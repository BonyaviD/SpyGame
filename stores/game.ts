import { defineStore } from "pinia";
import { MIN_PLAYERS } from "~/data/config";
import type { GamePhase, Round } from "~/types/game";
import { persistedRef } from "~/utils/persisted";
import { randomItem } from "~/utils/random";
import { usePlayers } from "./players";
import { useWords } from "./words";

const isRound = (value: unknown): value is Round | null => {
  if (value === null) return true;
  const round = value as Round;
  return (
    typeof round?.word === "string" &&
    Array.isArray(round.players) &&
    round.players.length >= MIN_PLAYERS &&
    Array.isArray(round.spyIds) &&
    typeof round.revealedCount === "number" &&
    (round.phase === "reveal" || round.phase === "result")
  );
};

export const useGame = defineStore("game", () => {
  const playersStore = usePlayers();
  const wordsStore = useWords();

  const round = persistedRef<Round | null>("round", null, isRound);

  const phase = computed<GamePhase>(() => round.value?.phase ?? "idle");

  /** The player whose turn it is to see their card, or null when everyone has seen it. */
  const currentPlayer = computed(() => round.value?.players[round.value.revealedCount] ?? null);
  const allRevealed = computed(
    () => !!round.value && round.value.revealedCount >= round.value.players.length,
  );

  const isSpy = (playerId: string) => round.value?.spyIds.includes(playerId) ?? false;

  /** Deals a new round to the current players: picks the word and the spy. */
  const startRound = () => {
    if (!playersStore.hasEnough) {
      throw new Error(`At least ${MIN_PLAYERS} players are needed to start a round.`);
    }
    const players = playersStore.players.map((player) => ({ ...player }));
    round.value = {
      players,
      word: wordsStore.pickWord(),
      spyIds: [randomItem(players).id],
      revealedCount: 0,
      phase: "reveal",
      isSpyRevealed: false,
    };
  };

  /** Called when the current player has seen their card and closed it. */
  const markCurrentRevealed = () => {
    if (round.value && !allRevealed.value) round.value.revealedCount++;
  };

  /** Moves from dealing cards to the discussion/result screen. */
  const finishReveal = () => {
    if (round.value && allRevealed.value) round.value.phase = "result";
  };

  const revealSpy = () => {
    if (round.value?.phase === "result") round.value.isSpyRevealed = true;
  };

  const abortRound = () => {
    round.value = null;
  };

  return {
    round,
    phase,
    currentPlayer,
    allRevealed,
    isSpy,
    startRound,
    markCurrentRevealed,
    finishReveal,
    revealSpy,
    abortRound,
  };
});
