<script setup>
import { onMounted, ref } from 'vue';
import ShortBG from "@/assets/background/short-background.svg";

const bgImage = ref(null);

onMounted(() => {
    bgImage.value = ShortBG;
});
</script>

<template>
    <div class="short-background" :style="{ backgroundImage: bgImage ? `url(${bgImage})` : '' }" >
      <slot />
    </div>
</template>

<style scoped>
.short-background {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 35rem;
}
</style>
