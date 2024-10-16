<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import DesktopView from "~/components/layouts/DesktopLayout.vue";
const isMobile = ref(false);

function checkMobileMode() {
  isMobile.value = window.matchMedia("(max-width: 576px)").matches;
}

onMounted(() => {
  checkMobileMode();
  window.addEventListener("resize", checkMobileMode);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobileMode);
});
</script>

<template>
  <NuxtLayout>
    <div :class="{ hidden: !isMobile }">
      <NuxtPage />
    </div>
    <DesktopView v-if="!isMobile" />
  </NuxtLayout>
</template>

<style scoped>
.hidden {
  display: none;
}
</style>
