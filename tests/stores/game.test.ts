import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useGame } from "~/stores/game";
import { usePlayers } from "~/stores/players";

const addPlayers = (...names: string[]) => {
  const players = usePlayers();
  names.forEach((name) => players.addPlayer(name));
  return players;
};

describe("game store", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it("refuses to start with fewer than the minimum players", () => {
    addPlayers("علی", "سارا");

    expect(() => useGame().startRound()).toThrow();
    expect(useGame().phase).toBe("idle");
  });

  it("starts a round with a word and exactly one spy among the players", () => {
    const players = addPlayers("علی", "سارا", "رضا");
    const game = useGame();
    game.startRound();

    expect(game.phase).toBe("reveal");
    expect(game.round?.word).toBeTruthy();
    expect(game.round?.spyIds).toHaveLength(1);
    expect(players.players.map((player) => player.id)).toContain(game.round?.spyIds[0]);
  });

  it("walks through every player before the result phase", () => {
    addPlayers("علی", "سارا", "رضا");
    const game = useGame();
    game.startRound();

    const turns: string[] = [];
    while (game.currentPlayer) {
      turns.push(game.currentPlayer.name);
      game.finishReveal(); // ignored until everyone has seen their card
      expect(game.phase).toBe("reveal");
      game.markCurrentRevealed();
    }

    expect(turns).toEqual(["علی", "سارا", "رضا"]);
    expect(game.allRevealed).toBe(true);
    game.finishReveal();
    expect(game.phase).toBe("result");
  });

  it("keeps the same word and spy after a reload", () => {
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

  it("keeps the players for a new round and snapshots them per round", () => {
    const players = addPlayers("علی", "سارا", "رضا");
    const game = useGame();
    game.startRound();
    players.addPlayer("مریم");

    expect(game.round?.players).toHaveLength(3);
    game.startRound();
    expect(game.round?.players).toHaveLength(4);
    expect(game.round?.revealedCount).toBe(0);
  });

  it("only reveals the spy in the result phase", () => {
    addPlayers("علی", "سارا", "رضا");
    const game = useGame();
    game.startRound();
    game.revealSpy();
    expect(game.round?.isSpyRevealed).toBe(false);

    while (game.currentPlayer) game.markCurrentRevealed();
    game.finishReveal();
    game.revealSpy();
    expect(game.round?.isSpyRevealed).toBe(true);
  });

  it("returns to idle when a round is aborted", () => {
    addPlayers("علی", "سارا", "رضا");
    const game = useGame();
    game.startRound();
    game.abortRound();

    expect(game.phase).toBe("idle");
    expect(usePlayers().players).toHaveLength(3);
  });
});
