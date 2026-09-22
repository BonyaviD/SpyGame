<template>
  <div class="shell">
    <div class="shell__device">
      <!-- Modals teleport here so they stay inside the device frame on desktop. -->
      <div id="overlay-root" />
      <slot />
    </div>
    <DesktopAside class="shell__aside" />
  </div>
</template>

<style scoped>
.shell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-16);
  min-height: 100dvh;
}

.shell__device {
  position: relative;
  width: 100%;
  max-width: var(--device-max-width);
  height: 100dvh;
  overflow: hidden;
  /* Makes position: fixed overlays relative to the device instead of the window. */
  contain: layout paint;
}

.shell__aside {
  display: none;
}

/* Tablet and up: the game is shown as a phone-sized column. */
@media (min-width: 40rem) and (min-height: 40rem) {
  .shell {
    padding: var(--space-8);
  }
  .shell__device {
    height: min(calc(100dvh - var(--space-16)), 58rem);
    border: 6px solid var(--color-scene);
    border-radius: 2rem;
    box-shadow: var(--shadow-lg);
  }
}

/* Desktop: show the QR code / credits next to the game. */
@media (min-width: 60rem) {
  .shell__aside {
    display: flex;
  }
}
</style>
