<script setup>
import { onMounted, ref } from "vue";
import LongBG from "@/assets/background/long-background.svg";

const bgImage = ref(null);

onMounted(() => {
  bgImage.value = LongBG;
});
</script>

<template>
  <div class="short-background" :style="{ backgroundImage: bgImage ? `url(${bgImage})` : '' }">
    <div class="slot">
        <slot />
    </div>
  </div>
</template>

<style scoped>
.short-background {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: calc(100% - 10rem);
}
.slot {
  margin-top: 12rem;
}
</style>
