<script setup lang="ts">
const value = defineModel<number>({ required: true });

const props = withDefaults(
  defineProps<{
    label: string;
    min?: number;
    max?: number;
    step?: number;
    /** Optional unit shown after the value, e.g. "دقیقه". */
    unit?: string;
  }>(),
  { min: 0, max: Number.POSITIVE_INFINITY, step: 1, unit: undefined },
);

const labelId = useId();

const change = (delta: number) => {
  value.value = Math.min(props.max, Math.max(props.min, value.value + delta));
};
</script>

<template>
  <div class="counter" role="group" :aria-labelledby="labelId">
    <span :id="labelId" class="counter__label">{{ label }}</span>
    <div class="counter__control">
      <button
        type="button"
        class="counter__button"
        :disabled="value >= max"
        :aria-label="`افزایش ${label}`"
        @click="change(step)"
      >
        +
      </button>
      <output class="counter__value" aria-live="polite">
        {{ value }}<span v-if="unit" class="counter__unit"> {{ unit }}</span>
      </output>
      <button
        type="button"
        class="counter__button"
        :disabled="value <= min"
        :aria-label="`کاهش ${label}`"
        @click="change(-step)"
      >
        −
      </button>
    </div>
  </div>
</template>

<style scoped>
.counter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}
.counter__label {
  font-size: var(--font-size-lg);
}
.counter__control {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.counter__button {
  width: var(--touch-target);
  height: var(--touch-target);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xl);
  line-height: 1;
}
.counter__button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.counter__value {
  min-width: 3ch;
  font-size: var(--font-size-xl);
  text-align: center;
  color: var(--color-accent);
}
.counter__unit {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
</style>
