<script setup lang="ts">
withDefaults(
  defineProps<{
    to: string;
    color?: string;
    width?: number | string;
    height?: number | string;
    size?: number | string;
  }>(),
  {
    color: "#DEA71A",
    width: 75,
    height: 75,
    size: 32,
  },
);
</script>

<template>
  <NuxtLink :to="to" class="back-icon">
    <svg
      :fill="color"
      :stroke="color"
      :width="`${width}px`"
      :height="`${height}px`"
      :viewBox="`0 0 ${size} ${size}`"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.17,10.23a33.37,33.37,0,0,0-3.05,3.13c-.51.62-1.28,1.3-1.21,2.17s.81,1.24,1.35,1.76a16.3,16.3,0,0,1,2.57,3.17c.86,1.36,3,.11,2.16-1.26a21.06,21.06,0,0,0-1.82-2.48A16.16,16.16,0,0,0,10,15.52c-.22-.21-.86-1.14-.68-.49l-.13,1a17.85,17.85,0,0,1,3.72-4c1.19-1.08-.58-2.85-1.77-1.76Z"
      />
      <path
        d="M9.4,17a109.13,109.13,0,0,0,12.53-.1c1.59-.11,1.61-2.61,0-2.5a109.13,109.13,0,0,1-12.53.1c-1.61-.07-1.6,2.43,0,2.5Z"
      />
    </svg>
  </NuxtLink>
</template>

<style scoped>
/* Kept on the left in the RTL layout to preserve the current design; revisit in the design-system phase. */
.back-icon {
  display: block;
  width: fit-content;
  margin-right: auto;
}
</style>
