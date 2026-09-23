import { defineStore } from "pinia";
import { MIN_PLAYERS, POINTS, maxSpiesFor } from "~/data/config";
import type { GamePhase, Round, RoundOutcome, RoundPhase } from "~/types/game";
import { persistedRef } from "~/utils/persisted";
import { randomItem, shuffle } from "~/utils/random";
import { usePlayers } from "./players";
import { useSettings } from "./settings";
import { useWords } from "./words";

const ROUND_PHASES: RoundPhase[] = ["reveal", "discussion", "voting", "result"];

const isRound = (value: unknown): value is Round | null => {
  if (value === null) return true;
  const round = value as Round;
  return (
    typeof round?.word === "string" &&
    typeof round.categoryId === "string" &&
    Array.isArray(round.players) &&
    round.players.length >= MIN_PLAYERS &&
    Array.isArray(round.spyIds) &&
    round.spyIds.length > 0 &&
    typeof round.starterId === "string" &&
    typeof round.revealedCount === "number" &&
    ROUND_PHASES.includes(round.phase) &&
    typeof round.timer?.durationMs === "number" &&
    Array.isArray(round.accusedIds) &&
    Array.isArray(round.guessOptions) &&
    typeof round.points === "object"
  );
};

const isScores = (value: unknown): value is Record<string, number> =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  Object.values(value).every((points) => typeof points === "number");

export const useGame = defineStore("game", () => {
  const playersStore = usePlayers();
  const settingsStore = useSettings();
  const wordsStore = useWords();

  const round = persistedRef<Round | null>("round", null, isRound);
  /** Total points per player id across rounds. */
  const scores = persistedRef<Record<string, number>>("scores", {}, isScores);

  const phase = computed<GamePhase>(() => round.value?.phase ?? "idle");

  /** The player whose turn it is to see their card, or null when everyone has seen it. */
  const currentPlayer = computed(() => round.value?.players[round.value.revealedCount] ?? null);
  const allRevealed = computed(
    () => !!round.value && round.value.revealedCount >= round.value.players.length,
  );
  const starter = computed(
    () => round.value?.players.find((player) => player.id === round.value!.starterId) ?? null,
  );
  const spies = computed(
    () => round.value?.players.filter((player) => round.value!.spyIds.includes(player.id)) ?? [],
  );

  const isSpy = (playerId: string) => round.value?.spyIds.includes(playerId) ?? false;

  /* ---------- Round lifecycle ---------- */

  /** Deals a new round to the current players using the saved settings. */
  const startRound = () => {
    if (!playersStore.hasEnough) {
      throw new Error(`At least ${MIN_PLAYERS} players are needed to start a round.`);
    }
    const { spyCount, roundMinutes, categories } = settingsStore.settings;
    const players = playersStore.players.map((player) => ({ ...player }));
    const { word, categoryId } = wordsStore.pickWord(categories);
    const durationMs = roundMinutes * 60_000;

    round.value = {
      players,
      word,
      categoryId,
      spyIds: shuffle(players)
        .slice(0, Math.min(spyCount, maxSpiesFor(players.length)))
        .map((player) => player.id),
      starterId: randomItem(players).id,
      revealedCount: 0,
      phase: "reveal",
      timer: { durationMs, endsAt: null, remainingMs: durationMs },
      accusedIds: [],
      guessOptions: [],
      spyGuess: null,
      outcome: null,
      points: {},
    };
  };

  /** Called when the current player has seen their card and closed it. */
  const markCurrentRevealed = () => {
    if (round.value && !allRevealed.value) round.value.revealedCount++;
  };

  /** Everyone has seen their card: start the discussion and its countdown. */
  const startDiscussion = (now = Date.now()) => {
    if (!round.value || round.value.phase !== "reveal" || !allRevealed.value) return;
    round.value.phase = "discussion";
    resumeTimer(now);
  };

  const abortRound = () => {
    round.value = null;
  };

  /* ---------- Timer ---------- */

  const remainingMs = (now = Date.now()) => {
    const timer = round.value?.timer;
    if (!timer) return 0;
    return timer.endsAt === null ? timer.remainingMs : Math.max(0, timer.endsAt - now);
  };

  const isTimerRunning = computed(() => round.value?.timer.endsAt != null);

  const pauseTimer = (now = Date.now()) => {
    const timer = round.value?.timer;
    if (!timer || timer.endsAt === null) return;
    timer.remainingMs = Math.max(0, timer.endsAt - now);
    timer.endsAt = null;
  };

  const resumeTimer = (now = Date.now()) => {
    const timer = round.value?.timer;
    if (!timer || timer.endsAt !== null || timer.remainingMs <= 0) return;
    timer.endsAt = now + timer.remainingMs;
  };

  /* ---------- Voting ---------- */

  /** Required number of suspects in the vote: one per spy. */
  const suspectCount = computed(() => round.value?.spyIds.length ?? 0);

  const startVoting = (now = Date.now()) => {
    if (round.value?.phase !== "discussion") return;
    pauseTimer(now);
    round.value.phase = "voting";
  };

  /**
   * Records the group's vote. Accusing any innocent player lets the spies escape;
   * catching all spies gives them one chance to guess the word.
   */
  const castVote = (accusedIds: string[]) => {
    const current = round.value;
    if (current?.phase !== "voting" || current.accusedIds.length) return;
    if (accusedIds.length !== suspectCount.value) {
      throw new Error(`Exactly ${suspectCount.value} suspects must be chosen.`);
    }
    current.accusedIds = [...accusedIds];
    if (accusedIds.every((id) => current.spyIds.includes(id))) {
      current.guessOptions = wordsStore.guessOptions(current.word, current.categoryId);
    } else {
      finishRound("spies-escaped");
    }
  };

  const spiesCaught = computed(
    () =>
      !!round.value?.accusedIds.length &&
      round.value.accusedIds.every((id) => round.value!.spyIds.includes(id)),
  );

  const submitGuess = (guess: string) => {
    const current = round.value;
    if (current?.phase !== "voting" || !spiesCaught.value || current.spyGuess !== null) return;
    current.spyGuess = guess;
    finishRound(guess === current.word ? "spies-guessed" : "citizens");
  };

  /* ---------- Scoring ---------- */

  const pointsFor = (outcome: RoundOutcome, isSpyPlayer: boolean) => {
    if (outcome === "citizens") return isSpyPlayer ? 0 : POINTS.citizensWin;
    if (!isSpyPlayer) return 0;
    return outcome === "spies-escaped" ? POINTS.spiesEscaped : POINTS.spiesGuessed;
  };

  const finishRound = (outcome: RoundOutcome) => {
    const current = round.value;
    if (!current || current.outcome) return;

    current.outcome = outcome;
    current.points = Object.fromEntries(
      current.players.map((player) => [player.id, pointsFor(outcome, isSpy(player.id))]),
    );
    const updated = { ...scores.value };
    Object.entries(current.points).forEach(([id, points]) => {
      updated[id] = (updated[id] ?? 0) + points;
    });
    scores.value = updated;
    current.phase = "result";
  };

  /** Current players with their total score, highest first. */
  const leaderboard = computed(() =>
    playersStore.players
      .map((player) => ({ ...player, score: scores.value[player.id] ?? 0 }))
      .sort((a, b) => b.score - a.score),
  );

  const hasScores = computed(() => Object.values(scores.value).some((points) => points > 0));

  const resetScores = () => {
    scores.value = {};
  };

  return {
    round,
    scores,
    phase,
    currentPlayer,
    allRevealed,
    starter,
    spies,
    isSpy,
    startRound,
    markCurrentRevealed,
    startDiscussion,
    abortRound,
    remainingMs,
    isTimerRunning,
    pauseTimer,
    resumeTimer,
    suspectCount,
    startVoting,
    castVote,
    spiesCaught,
    submitGuess,
    leaderboard,
    hasScores,
    resetScores,
  };
});
