<script setup lang="ts">
defineProps<{
  text: string;
  to: string;
  border?: boolean;
}>();
</script>

<template>
  <NuxtLink :to="to">
    <div class="custom-btn" :class="border ? 'border-btn' : 'full-btn'">
      {{ text }}
    </div>
  </NuxtLink>
</template>

<style scoped>
.custom-btn {
  text-align: center;
  width: clamp(20rem, 100%, 30rem);
  font-size: 2.5rem;
  padding: 1rem 0;
  margin: 0 auto;
  border-radius: 8px;
}

.border-btn {
  border: 2px solid var(--border-btn);
}

.full-btn {
  background-color: var(--background-btn);
}
</style>
