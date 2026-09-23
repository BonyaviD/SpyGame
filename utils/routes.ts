import type { GamePhase, RoundPhase } from "~/types/game";

const ROUTE_FOR_PHASE: Record<GamePhase, string> = {
  idle: "/setup",
  reveal: "/reveal",
  discussion: "/discussion",
  voting: "/voting",
  result: "/result",
};

/** Route of the page for a game phase ("/setup" when no round is running). */
export const routeForPhase = (phase: GamePhase) => ROUTE_FOR_PHASE[phase];

/** The round phase a page belongs to, or undefined for pages outside a round. */
export const phaseForRoute = (path: string): RoundPhase | undefined =>
  (Object.entries(ROUTE_FOR_PHASE) as [GamePhase, string][]).find(
    ([phase, route]) => phase !== "idle" && route === path,
  )?.[0] as RoundPhase | undefined;
