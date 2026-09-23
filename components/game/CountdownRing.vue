<script setup lang="ts">
import { formatDuration } from "~/utils/format";

const props = defineProps<{
  remainingMs: number;
  /** 1 = full, 0 = empty. */
  progress: number;
  paused?: boolean;
}>();

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const dashOffset = computed(() => CIRCUMFERENCE * (1 - Math.min(1, Math.max(0, props.progress))));
const isUrgent = computed(() => props.remainingMs > 0 && props.remainingMs <= 30_000);
const isOver = computed(() => props.remainingMs <= 0);
</script>

<template>
  <div
    class="ring"
    :class="{ 'ring--urgent': isUrgent, 'ring--over': isOver, 'ring--paused': paused }"
    role="timer"
    :aria-label="`زمان باقی‌مانده ${formatDuration(remainingMs)}`"
  >
    <svg class="ring__svg" viewBox="0 0 120 120" aria-hidden="true">
      <circle class="ring__track" cx="60" cy="60" :r="RADIUS" />
      <circle
        class="ring__progress"
        cx="60"
        cy="60"
        :r="RADIUS"
        :stroke-dasharray="CIRCUMFERENCE"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <div class="ring__label">
      <span class="ring__time" dir="ltr">{{ formatDuration(remainingMs) }}</span>
      <span v-if="paused && !isOver" class="ring__status">متوقف</span>
      <span v-else-if="isOver" class="ring__status">زمان تمام شد!</span>
    </div>
  </div>
</template>

<style scoped>
.ring {
  position: relative;
  width: min(15rem, 70%);
  aspect-ratio: 1;
}
.ring__svg {
  width: 100%;
  height: 100%;
  /* Start at 12 o'clock; mirrored so the arc empties in reading (RTL) direction. */
  transform: rotate(-90deg) scaleY(-1);
}
.ring__track,
.ring__progress {
  fill: none;
  stroke-width: 8;
}
.ring__track {
  stroke: var(--color-surface);
}
.ring__progress {
  stroke: var(--color-primary);
  stroke-linecap: round;
  transition:
    stroke-dashoffset 250ms linear,
    stroke var(--duration-normal) var(--ease-standard);
}
.ring--urgent .ring__progress,
.ring--over .ring__progress {
  stroke: var(--color-danger-text);
}
.ring--paused .ring__progress {
  stroke: var(--color-text-muted);
}
.ring__label {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
}
.ring__time {
  font-size: 3rem;
  font-variant-numeric: tabular-nums;
}
.ring--urgent .ring__time,
.ring--over .ring__time {
  color: var(--color-danger-text);
}
.ring__status {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
</style>
