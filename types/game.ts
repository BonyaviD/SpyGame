export interface Player {
  id: string;
  name: string;
}

export type GamePhase = "idle" | "reveal" | "result";

/** One round of the game, from dealing the cards to revealing the spy. */
export interface Round {
  /** Players of this round, in card-dealing order (a snapshot, not live references). */
  players: Player[];
  word: string;
  spyIds: string[];
  /** How many players have already seen and closed their card. */
  revealedCount: number;
  phase: Exclude<GamePhase, "idle">;
  isSpyRevealed: boolean;
}
