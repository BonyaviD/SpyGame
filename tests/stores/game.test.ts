import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { POINTS } from "~/data/config";
import { useGame } from "~/stores/game";
import { usePlayers } from "~/stores/players";
import { useSettings } from "~/stores/settings";

const addPlayers = (...names: string[]) => {
  const players = usePlayers();
  names.forEach((name) => players.addPlayer(name));
  return players;
};

/** Starts a round and deals every card, leaving the round in the discussion phase. */
const playToDiscussion = (now = 0) => {
  const game = useGame();
  game.startRound();
  while (game.currentPlayer) game.markCurrentRevealed();
  game.startDiscussion(now);
  return game;
};

const innocentIds = () => {
  const game = useGame();
  return game.round!.players.map((player) => player.id).filter((id) => !game.isSpy(id));
};

describe("game store", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  describe("starting a round", () => {
    it("refuses to start with fewer than the minimum players", () => {
      addPlayers("علی", "سارا");

      expect(() => useGame().startRound()).toThrow();
      expect(useGame().phase).toBe("idle");
    });

    it("deals a word from the chosen categories, one spy and a starting player", () => {
      const players = addPlayers("علی", "سارا", "رضا");
      useSettings().toggleCategory("food"); // turn one category off
      const game = useGame();
      game.startRound();

      const ids = players.players.map((player) => player.id);
      expect(game.phase).toBe("reveal");
      expect(game.round?.categoryId).not.toBe("food");
      expect(game.round?.spyIds).toHaveLength(1);
      expect(ids).toContain(game.round?.spyIds[0]);
      expect(ids).toContain(game.round?.starterId);
    });

    it("uses the configured spy count, capped by the number of players", () => {
      addPlayers("۱", "۲", "۳", "۴", "۵", "۶");
      const settings = useSettings();
      const game = useGame();

      settings.settings.spyCount = 2;
      game.startRound();
      expect(game.round?.spyIds).toHaveLength(2);
      expect(new Set(game.round?.spyIds).size).toBe(2);

      settings.settings.spyCount = 5;
      game.startRound();
      expect(game.round?.spyIds).toHaveLength(2);
    });

    it("snapshots the players, so later edits only affect the next round", () => {
      const players = addPlayers("علی", "سارا", "رضا");
      const game = useGame();
      game.startRound();
      players.addPlayer("مریم");

      expect(game.round?.players).toHaveLength(3);
      game.startRound();
      expect(game.round?.players).toHaveLength(4);
    });
  });

  describe("dealing cards", () => {
    it("walks through every player before the discussion can start", () => {
      addPlayers("علی", "سارا", "رضا");
      const game = useGame();
      game.startRound();

      const turns: string[] = [];
      while (game.currentPlayer) {
        turns.push(game.currentPlayer.name);
        game.startDiscussion(); // ignored until everyone has seen their card
        expect(game.phase).toBe("reveal");
        game.markCurrentRevealed();
      }
      game.startDiscussion();

      expect(turns).toEqual(["علی", "سارا", "رضا"]);
      expect(game.phase).toBe("discussion");
    });

    it("keeps the same word, spy and turn after a reload", () => {
      addPlayers("علی", "سارا", "رضا");
      const game = useGame();
      game.startRound();
      game.markCurrentRevealed();
      const { word, spyIds } = game.round!;

      setActivePinia(createPinia());
      const reloaded = useGame();
      expect(reloaded.round?.word).toBe(word);
      expect(reloaded.round?.spyIds).toEqual(spyIds);
      expect(reloaded.round?.revealedCount).toBe(1);
    });
  });

  describe("discussion timer", () => {
    it("counts down from the configured duration and can be paused", () => {
      addPlayers("علی", "سارا", "رضا");
      useSettings().settings.roundMinutes = 2;
      const game = playToDiscussion(1_000);

      expect(game.isTimerRunning).toBe(true);
      expect(game.remainingMs(1_000)).toBe(120_000);
      expect(game.remainingMs(31_000)).toBe(90_000);

      game.pauseTimer(31_000);
      expect(game.remainingMs(99_000)).toBe(90_000);

      game.resumeTimer(100_000);
      expect(game.remainingMs(110_000)).toBe(80_000);
      expect(game.remainingMs(10_000_000)).toBe(0);
    });

    it("pauses the timer when voting starts", () => {
      addPlayers("علی", "سارا", "رضا");
      const game = playToDiscussion(0);
      game.startVoting(60_000);

      expect(game.phase).toBe("voting");
      expect(game.isTimerRunning).toBe(false);
    });
  });

  describe("voting and scoring", () => {
    it("lets the spies escape when an innocent player is accused", () => {
      addPlayers("علی", "سارا", "رضا");
      const game = playToDiscussion();
      game.startVoting();
      game.castVote([innocentIds()[0]]);

      expect(game.phase).toBe("result");
      expect(game.round?.outcome).toBe("spies-escaped");
      expect(game.scores[game.round!.spyIds[0]]).toBe(POINTS.spiesEscaped);
      innocentIds().forEach((id) => expect(game.scores[id] ?? 0).toBe(0));
    });

    it("gives caught spies a guess that includes the word", () => {
      addPlayers("علی", "سارا", "رضا");
      const game = playToDiscussion();
      game.startVoting();
      game.castVote(game.round!.spyIds);

      expect(game.phase).toBe("voting");
      expect(game.spiesCaught).toBe(true);
      expect(game.round?.guessOptions).toContain(game.round?.word);
      expect(new Set(game.round?.guessOptions).size).toBe(game.round?.guessOptions.length);
    });

    it("lets citizens win when the caught spy guesses wrong", () => {
      addPlayers("علی", "سارا", "رضا");
      const game = playToDiscussion();
      game.startVoting();
      game.castVote(game.round!.spyIds);
      game.submitGuess(game.round!.guessOptions.find((option) => option !== game.round!.word)!);

      expect(game.round?.outcome).toBe("citizens");
      innocentIds().forEach((id) => expect(game.scores[id]).toBe(POINTS.citizensWin));
      expect(game.scores[game.round!.spyIds[0]]).toBe(0);
    });

    it("lets the caught spy win by guessing the word", () => {
      addPlayers("علی", "سارا", "رضا");
      const game = playToDiscussion();
      game.startVoting();
      game.castVote(game.round!.spyIds);
      game.submitGuess(game.round!.word);

      expect(game.round?.outcome).toBe("spies-guessed");
      expect(game.scores[game.round!.spyIds[0]]).toBe(POINTS.spiesGuessed);
    });

    it("requires exactly one suspect per spy and ignores a second vote", () => {
      addPlayers("علی", "سارا", "رضا");
      const game = playToDiscussion();
      game.startVoting();

      expect(() => game.castVote([])).toThrow();
      game.castVote([innocentIds()[0]]);
      const scores = { ...game.scores };
      game.castVote(game.round!.spyIds);
      expect(game.round?.outcome).toBe("spies-escaped");
      expect(game.scores).toEqual(scores);
    });

    it("adds up scores across rounds and can reset them", () => {
      addPlayers("علی", "سارا", "رضا");
      const game = useGame();

      for (let round = 0; round < 2; round++) {
        playToDiscussion();
        game.startVoting();
        game.castVote(game.round!.spyIds);
        game.submitGuess("—"); // wrong guess: citizens win
      }

      const total = Object.values(game.scores).reduce((sum, points) => sum + points, 0);
      expect(total).toBe(2 * 2 * POINTS.citizensWin);
      expect(game.leaderboard[0].score).toBeGreaterThan(0);

      game.resetScores();
      expect(game.hasScores).toBe(false);
    });
  });

  it("returns to idle when a round is aborted, keeping the players", () => {
    addPlayers("علی", "سارا", "رضا");
    const game = useGame();
    game.startRound();
    game.abortRound();

    expect(game.phase).toBe("idle");
    expect(usePlayers().players).toHaveLength(3);
  });
});
