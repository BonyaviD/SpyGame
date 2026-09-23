<script setup lang="ts">
defineProps<{
  /** Toggle state; rendered as aria-pressed. */
  pressed: boolean;
  disabled?: boolean;
}>();

defineEmits<{ click: [event: MouseEvent] }>();
</script>

<template>
  <button
    type="button"
    class="chip"
    :class="{ 'chip--pressed': pressed }"
    :aria-pressed="pressed"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.chip {
  min-height: 2.25rem;
  padding: var(--space-1) var(--space-4);
  border: 1.5px solid var(--color-surface-raised);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  transition:
    background-color var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard),
    border-color var(--duration-fast) var(--ease-standard);
}
.chip--pressed {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
  color: var(--color-on-primary);
}
.chip:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
