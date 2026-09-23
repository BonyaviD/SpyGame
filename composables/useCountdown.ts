import { useGame } from "~/stores/game";

/**
 * Live view of the round timer. Time is derived from the saved end timestamp, so it stays
 * correct across reloads and while the phone was locked; `onTimeUp` fires once when the
 * countdown reaches zero while the page is open.
 */
export const useCountdown = (onTimeUp?: () => void) => {
  const game = useGame();
  const now = ref(Date.now());

  const remainingMs = computed(() => game.remainingMs(now.value));
  const totalMs = computed(() => game.round?.timer.durationMs ?? 0);
  const isTimeUp = computed(() => remainingMs.value <= 0);
  const progress = computed(() => (totalMs.value ? remainingMs.value / totalMs.value : 0));

  let interval: ReturnType<typeof setInterval> | undefined;
  onMounted(() => {
    interval = setInterval(() => (now.value = Date.now()), 250);
  });
  onUnmounted(() => clearInterval(interval));

  watch(isTimeUp, (timeUp, wasTimeUp) => {
    if (timeUp && wasTimeUp === false) onTimeUp?.();
  });

  return { remainingMs, totalMs, progress, isTimeUp };
};
