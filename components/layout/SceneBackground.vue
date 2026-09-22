<template>
  <div class="scene">
    <div class="scene__edge" aria-hidden="true" />
    <div class="scene__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/*
 * The dark "graveyard" ground: a grass silhouette on top of a solid block.
 * Only the top strip of the artwork is used so the block can grow to any height.
 */
.scene {
  display: flex;
  flex-direction: column;
}
.scene__edge {
  flex-shrink: 0;
  aspect-ratio: 430 / 116;
  margin-bottom: -1px;
  background: url("~/assets/background/short-background.svg") top center / 100% auto no-repeat;
}
.scene__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  background-color: var(--color-scene);
}
</style>
