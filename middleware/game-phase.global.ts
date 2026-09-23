import { useGame } from "~/stores/game";
import type { GamePhase } from "~/types/game";

/** Pages that belong to a phase of a running round. */
const PHASE_ROUTES: Record<string, Exclude<GamePhase, "idle">> = {
  "/reveal": "reveal",
  "/result": "result",
};

const ROUTE_FOR_PHASE: Record<GamePhase, string> = {
  idle: "/setup",
  reveal: "/reveal",
  result: "/result",
};

/**
 * Keeps round pages in sync with the saved game phase, so direct links, reloads and the
 * browser back button never show a page for a round that doesn't exist or is already past.
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const requiredPhase = PHASE_ROUTES[to.path];
  if (!requiredPhase) return;

  const { phase } = useGame();
  if (phase === requiredPhase) return;

  const target = ROUTE_FOR_PHASE[phase];
  // Already there (e.g. browser back from /result to /reveal): cancel, which also restores the URL.
  if (target === from.path) return abortNavigation();
  return navigateTo(target, { replace: true });
});
