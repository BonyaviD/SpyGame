import { useGame } from "~/stores/game";
import { phaseForRoute, routeForPhase } from "~/utils/routes";

/**
 * Keeps round pages in sync with the saved game phase, so direct links, reloads and the
 * browser back button never show a page for a round that doesn't exist or is already past.
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const requiredPhase = phaseForRoute(to.path);
  if (!requiredPhase) return;

  const { phase } = useGame();
  if (phase === requiredPhase) return;

  const target = routeForPhase(phase);
  // Already there (e.g. browser back from /result to /voting): cancel, which also restores the URL.
  if (target === from.path) return abortNavigation();
  return navigateTo(target, { replace: true });
});
