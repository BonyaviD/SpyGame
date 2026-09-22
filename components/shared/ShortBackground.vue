<template>
  <div class="short-background">
    <slot />
  </div>
</template>

<style scoped>
.short-background {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 35rem;
  background-image: url("~/assets/background/short-background.svg");
}
</style>
