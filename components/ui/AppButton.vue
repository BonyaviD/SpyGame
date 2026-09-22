<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

export type ButtonVariant = "primary" | "outline" | "ghost" | "danger";
export type ButtonSize = "md" | "lg";

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant;
    size?: ButtonSize;
    /** Renders a link instead of a button. */
    to?: RouteLocationRaw;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    block?: boolean;
  }>(),
  {
    variant: "primary",
    size: "lg",
    to: undefined,
    type: "button",
    disabled: false,
    block: false,
  },
);

const emit = defineEmits<{ click: [event: MouseEvent] }>();

const classes = computed(() => [
  "app-button",
  `app-button--${props.variant}`,
  `app-button--${props.size}`,
  { "app-button--block": props.block, "app-button--disabled": props.disabled },
]);
</script>

<template>
  <NuxtLink v-if="to && !disabled" :to="to" :class="classes" @click="emit('click', $event)">
    <slot />
  </NuxtLink>
  <button v-else :type="type" :class="classes" :disabled="disabled" @click="emit('click', $event)">
    <slot />
  </button>
</template>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: var(--touch-target);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  line-height: 1;
  text-align: center;
  cursor: pointer;
  user-select: none;
  transition:
    transform var(--duration-fast) var(--ease-standard),
    opacity var(--duration-fast) var(--ease-standard);
}
.app-button:active:not(.app-button--disabled) {
  transform: scale(0.97);
}

/* Sizes */
.app-button--md {
  padding: var(--space-2) var(--space-6);
  font-size: var(--font-size-md);
}
.app-button--lg {
  min-height: 3.5rem;
  padding: var(--space-3) var(--space-8);
  font-size: var(--font-size-xl);
}
.app-button--block {
  display: flex;
  width: 100%;
}

/* Variants */
.app-button--primary {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
}
.app-button--outline {
  border-color: var(--color-primary);
  color: var(--color-text);
}
.app-button--ghost {
  color: var(--color-text);
}
.app-button--danger {
  background-color: var(--color-danger);
  color: var(--color-on-primary);
}

.app-button--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
