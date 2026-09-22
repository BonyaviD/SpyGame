<script setup lang="ts">
import logo from "~/assets/img/logo.svg";
</script>

<template>
  <div class="logo">
    <img :src="logo" alt="" />
  </div>
</template>

<style scoped>
.logo {
  margin-top: 4rem;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: end;
}
</style>
