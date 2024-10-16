<script setup>
import { defineProps } from "vue";
const props = defineProps({
  text: {
    type: String,
  },
  border: {
    type: Boolean,
    default: false,
  },
  to: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <NuxtLink :to="props.to">
    <div class="custom-btn" :class="props.border ? 'border-btn' : 'full-btn'">
      {{ props.text }}
    </div>
  </NuxtLink>
</template>

<style scoped>
.custom-btn {
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
  background-color: var(--border-btn);
}
</style>
