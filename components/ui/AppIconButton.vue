<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";
import type { IconName } from "./AppIcon.vue";

withDefaults(
  defineProps<{
    icon: IconName;
    /** Accessible name — icon-only controls must describe their action. */
    label: string;
    to?: RouteLocationRaw;
    size?: string;
    variant?: "plain" | "solid";
  }>(),
  { to: undefined, size: "2.5rem", variant: "plain" },
);

const emit = defineEmits<{ click: [event: MouseEvent] }>();
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="icon-button"
    :class="`icon-button--${variant}`"
    :aria-label="label"
    @click="emit('click', $event)"
  >
    <AppIcon :name="icon" :size="size" />
  </NuxtLink>
  <button
    v-else
    type="button"
    class="icon-button"
    :class="`icon-button--${variant}`"
    :aria-label="label"
    @click="emit('click', $event)"
  >
    <AppIcon :name="icon" :size="size" />
  </button>
</template>

<style scoped>
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--touch-target);
  min-height: var(--touch-target);
  border-radius: var(--radius-full);
  color: var(--color-primary);
  transition: transform var(--duration-fast) var(--ease-standard);
}
.icon-button:active {
  transform: scale(0.9);
}

/* Small filled badge (e.g. remove player) with an enlarged invisible hit area. */
.icon-button--solid {
  position: relative;
  min-width: 0;
  min-height: 0;
  padding: var(--space-1);
  background-color: var(--color-text);
  color: var(--color-text-inverse);
}
.icon-button--solid::after {
  content: "";
  position: absolute;
  inset: -10px;
}
</style>
