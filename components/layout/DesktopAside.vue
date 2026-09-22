<script setup lang="ts">
import qrCode from "~/assets/img/spy-qrcode.svg";
</script>

<template>
  <aside class="aside">
    <AppLogo with-text size="lg" />
    <img class="aside__qr" :src="qrCode" alt="QR code آدرس بازی" />
    <p class="aside__hint">برای بازی گروهی، با گوشی اسکن کنید و گوشی را دست‌به‌دست بچرخانید.</p>
    <AppCredit />
  </aside>
</template>

<style scoped>
.aside {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
  max-width: 20rem;
  text-align: center;
}
.aside__qr {
  width: 12rem;
}
.aside__hint {
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);
}
</style>
