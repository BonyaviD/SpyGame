<template>
  <div class="long-background">
    <div class="slot">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.long-background {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: calc(100% - 10rem);
  background-image: url("~/assets/background/long-background.svg");
}
.slot {
  margin-top: 12rem;
}
</style>
