<script setup lang="ts">
export type IconName = "back" | "plus" | "close";

const props = withDefaults(
  defineProps<{
    name: IconName;
    size?: string;
  }>(),
  { size: "1.5em" },
);

// "back" is drawn pointing left (LTR); it is mirrored automatically in RTL.
const mirroredInRtl = computed(() => props.name === "back");
</script>

<template>
  <svg
    class="app-icon"
    :class="{ 'mirror-rtl': mirroredInRtl }"
    :width="size"
    :height="size"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    :viewBox="name === 'back' ? '0 0 32 32' : '0 0 24 24'"
  >
    <g v-if="name === 'back'" fill="currentColor" stroke="currentColor">
      <path
        d="M11.17,10.23a33.37,33.37,0,0,0-3.05,3.13c-.51.62-1.28,1.3-1.21,2.17s.81,1.24,1.35,1.76a16.3,16.3,0,0,1,2.57,3.17c.86,1.36,3,.11,2.16-1.26a21.06,21.06,0,0,0-1.82-2.48A16.16,16.16,0,0,0,10,15.52c-.22-.21-.86-1.14-.68-.49l-.13,1a17.85,17.85,0,0,1,3.72-4c1.19-1.08-.58-2.85-1.77-1.76Z"
      />
      <path
        d="M9.4,17a109.13,109.13,0,0,0,12.53-.1c1.59-.11,1.61-2.61,0-2.5a109.13,109.13,0,0,1-12.53.1c-1.61-.07-1.6,2.43,0,2.5Z"
      />
    </g>
    <path
      v-else-if="name === 'plus'"
      d="M6 12H18M12 6V18"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
    <path
      v-else-if="name === 'close'"
      d="M7 7L17 17M17 7L7 17"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
    />
  </svg>
</template>

<style scoped>
.app-icon {
  flex-shrink: 0;
}
/* RTL mirroring (.mirror-rtl) lives in base.css because it depends on <html dir>. */
</style>
