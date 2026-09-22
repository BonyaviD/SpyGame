<script setup lang="ts">
import logo from "~/assets/img/logo.svg";
import spyText from "~/assets/img/spy-text.svg";

withDefaults(
  defineProps<{
    /** Also shows the "جاسوس" wordmark under the eyes. */
    withText?: boolean;
    size?: "md" | "lg";
  }>(),
  { withText: false, size: "md" },
);
</script>

<template>
  <div class="logo" :class="`logo--${size}`">
    <img class="logo__eyes" :src="logo" :alt="withText ? '' : 'جاسوس'" />
    <img v-if="withText" class="logo__text" :src="spyText" alt="جاسوس" />
  </div>
</template>

<style scoped>
.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-12);
}
.logo--md .logo__eyes {
  width: 9rem;
}
.logo--lg .logo__eyes {
  width: 11.5rem;
}
.logo__text {
  width: 12.5rem;
}
</style>
