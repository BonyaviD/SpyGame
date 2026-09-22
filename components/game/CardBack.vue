<script setup lang="ts">
import cardBack from "~/assets/img/card-back.svg";
</script>

<template>
  <img class="card-back" :src="cardBack" alt="" draggable="false" />
</template>

<style scoped>
.card-back {
  width: 100%;
  aspect-ratio: var(--card-ratio);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}
</style>
