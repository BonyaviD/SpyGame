<script setup lang="ts">
import DesktopLayout from "~/components/desktop/DesktopLayout.vue";

const { isMobile } = useDevice();
</script>

<template>
  <NuxtLayout>
    <NuxtPage v-if="isMobile" />
    <DesktopLayout v-else />
  </NuxtLayout>
</template>
