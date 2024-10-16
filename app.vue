<script setup>
import { useResolationCheck } from "@/stores/useResolationCheck"
import DesktopView from "@/components/desktop/DesktopLayout.vue"

const resolationCheck = useResolationCheck()
</script>

<template>
  <NuxtLayout>
    <DesktopView v-if="!resolationCheck.isMobile" />
    <div :class="{ hidden: !resolationCheck.isMobile }">
      <NuxtPage />
    </div>
  </NuxtLayout>
</template>

<style scoped>
.hidden {
  display: none;
}
</style>
