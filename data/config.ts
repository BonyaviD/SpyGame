/** Game-wide limits and constants. */
export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 20;
export const MAX_NAME_LENGTH = 12;

/** One spy per this many players, at most (e.g. 6 players → up to 2 spies). */
export const PLAYERS_PER_SPY = 3;

export const MIN_ROUND_MINUTES = 1;
export const MAX_ROUND_MINUTES = 15;
export const DEFAULT_ROUND_MINUTES = 5;

/** Number of choices offered to caught spies when guessing the word. */
export const GUESS_OPTION_COUNT = 6;

/** Points per player at the end of a round. */
export const POINTS = {
  /** Each citizen, when the spies are caught and miss the word. */
  citizensWin: 1,
  /** Each spy, when the group accuses an innocent player. */
  spiesEscaped: 2,
  /** Each spy, when caught but guessing the word correctly. */
  spiesGuessed: 1,
} as const;

/** Text shown on the spy's card. */
export const SPY_CARD_TEXT = "جاسوس";

/** How many recent words are avoided when picking a new one (capped at half the pool). */
export const WORD_HISTORY_SIZE = 40;

/** Largest allowed spy count for a number of players. */
export const maxSpiesFor = (playerCount: number) =>
  Math.max(1, Math.floor(playerCount / PLAYERS_PER_SPY));
