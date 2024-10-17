<script setup>
import QRcode from "@/assets/img/spy-qrcode.svg";
import Logo from "../shared/Logo.vue";
</script>
<template>
  <div>
    <Logo />
  <div class="desktop">
    <img :src="QRcode" alt="" />
    <p>با موبایل وارد شوید</p>
  </div>
  </div>
</template>

<style scoped>
.desktop {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3.5rem;
  margin-top: 3rem;
}

.desktop img {
  width: 350px;
}
</style>
