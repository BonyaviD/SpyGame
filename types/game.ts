import type { WordCategoryId } from "~/data/words";

export interface Player {
  id: string;
  name: string;
}

export interface GameSettings {
  spyCount: number;
  roundMinutes: number;
  /** Word categories to draw from; never empty. */
  categories: WordCategoryId[];
}

export type RoundPhase = "reveal" | "discussion" | "voting" | "result";
export type GamePhase = "idle" | RoundPhase;

/**
 * Discussion countdown. While running, `endsAt` is set and is the source of truth
 * (so it survives reloads and background tabs); while paused, `remainingMs` is.
 */
export interface RoundTimer {
  durationMs: number;
  endsAt: number | null;
  remainingMs: number;
}

export type RoundOutcome =
  /** The group accused at least one innocent player. */
  | "spies-escaped"
  /** The spies were caught but guessed the secret word. */
  | "spies-guessed"
  /** The spies were caught and missed the word. */
  | "citizens";

/** One round of the game, from dealing the cards to the final result. */
export interface Round {
  /** Players of this round, in card-dealing order (a snapshot, not live references). */
  players: Player[];
  word: string;
  categoryId: WordCategoryId;
  spyIds: string[];
  /** Player who asks the first question in the discussion. */
  starterId: string;
  /** How many players have already seen and closed their card. */
  revealedCount: number;
  phase: RoundPhase;
  timer: RoundTimer;
  /** Players the group voted for; empty until the vote is cast. */
  accusedIds: string[];
  /** Words the caught spies choose their guess from. */
  guessOptions: string[];
  spyGuess: string | null;
  outcome: RoundOutcome | null;
  /** Points each player earned this round (set when the round ends). */
  points: Record<string, number>;
}
