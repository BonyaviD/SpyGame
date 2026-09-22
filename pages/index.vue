<script setup lang="ts">
import ShortBackground from "~/components/shared/ShortBackground.vue";
import Button from "~/components/shared/Button.vue";
import spyLogo from "~/assets/img/logo.svg";
import spyText from "~/assets/img/spy-text.svg";
</script>

<template>
  <div class="home-page">
    <div class="home-header">
      <img :src="spyLogo" alt="" />
      <img :src="spyText" alt="" />
    </div>
    <ShortBackground>
      <div class="home-btns">
        <Button text="راهنمای بازی؟" to="/guide" border />
        <Button text="شروع بازی!" to="/setup" />
      </div>
    </ShortBackground>
  </div>
</template>

<style scoped>
.home-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6rem 0;
  gap: 5rem 0;
}
.home-btns {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem 0;
  width: 100%;
  height: 100%;
  padding-top: 10rem;
}
</style>
