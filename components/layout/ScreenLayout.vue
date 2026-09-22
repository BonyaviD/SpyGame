<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

withDefaults(
  defineProps<{
    /** Target of the header back button; hidden when omitted. */
    back?: RouteLocationRaw;
    /** Page title shown in the header instead of the logo. */
    title?: string;
    /**
     * "full": the scene fills the screen below the header (default).
     * "compact": the header takes the free space and the scene fits its content.
     */
    variant?: "full" | "compact";
  }>(),
  { back: undefined, title: undefined, variant: "full" },
);

defineEmits<{ back: [event: MouseEvent] }>();
</script>

<template>
  <div class="screen" :class="`screen--${variant}`">
    <header class="screen__header">
      <AppIconButton
        v-if="back"
        class="screen__back"
        icon="back"
        label="بازگشت"
        :to="back"
        @click="$emit('back', $event)"
      />
      <slot name="header">
        <h1 v-if="title" class="screen__title">{{ title }}</h1>
        <AppLogo v-else />
      </slot>
    </header>

    <SceneBackground class="screen__scene">
      <main class="screen__body">
        <slot />
      </main>
      <footer v-if="$slots.footer" class="screen__footer">
        <slot name="footer" />
      </footer>
    </SceneBackground>
  </div>
</template>

<style scoped>
.screen {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.screen__header {
  position: relative;
  z-index: var(--z-header);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-height: 8.5rem;
  padding: var(--space-8) var(--space-16) 0;
  padding-top: max(var(--space-8), env(safe-area-inset-top));
}
.screen__back {
  position: absolute;
  top: max(var(--space-3), env(safe-area-inset-top));
  inset-inline-start: var(--space-3);
}
.screen__title {
  font-size: var(--font-size-3xl);
  font-weight: normal;
  color: var(--color-text);
  text-align: center;
}

.screen__scene {
  position: relative;
  z-index: var(--z-scene);
  flex: 1;
  min-height: 0;
  /* Let the grass overlap the bottom of the header art. */
  margin-top: calc(var(--space-12) * -1);
}

.screen__body {
  flex: 1;
  min-height: 0;
  padding: var(--space-4) var(--space-6);
  overflow-y: auto;
  overscroll-behavior: contain;
}

.screen__footer {
  z-index: var(--z-footer);
  flex-shrink: 0;
  padding: var(--space-4) var(--space-6);
  padding-bottom: max(var(--space-6), env(safe-area-inset-bottom));
}

/* Compact: big header, scene sized to its content. */
.screen--compact .screen__header {
  flex: 1;
  padding-top: max(var(--space-16), env(safe-area-inset-top));
  align-items: flex-start;
}
.screen--compact .screen__scene {
  flex: none;
}
.screen--compact .screen__body {
  overflow: visible;
}
</style>
