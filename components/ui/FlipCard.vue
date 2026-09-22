<script setup lang="ts">
defineProps<{
  /** true shows the back face. */
  flipped: boolean;
  /** Accessible label of the card button in its current state. */
  label: string;
}>();

defineEmits<{ click: [] }>();
</script>

<template>
  <button
    type="button"
    class="flip-card"
    :class="{ 'flip-card--flipped': flipped }"
    :aria-label="label"
    @click="$emit('click')"
  >
    <span class="flip-card__inner">
      <span class="flip-card__face flip-card__face--front" :aria-hidden="flipped">
        <slot name="front" />
      </span>
      <span class="flip-card__face flip-card__face--back" :aria-hidden="!flipped">
        <slot name="back" />
      </span>
    </span>
  </button>
</template>

<style scoped>
.flip-card {
  display: block;
  width: 100%;
  aspect-ratio: var(--card-ratio);
  perspective: 1200px;
  border-radius: var(--radius-md);
}
.flip-card__inner {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform var(--duration-slow) var(--ease-standard);
}
.flip-card--flipped .flip-card__inner {
  transform: rotateY(180deg);
}
.flip-card__face {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: var(--radius-md);
  backface-visibility: hidden;
}
.flip-card__face--back {
  transform: rotateY(180deg);
}
</style>
