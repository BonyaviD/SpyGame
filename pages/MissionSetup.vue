<script setup>
import BackIcon from "@/components/shared/BackIcon.vue";
import Logo from "@/components/shared/Logo.vue";
import LongBackground from "@/components/shared/LongBackground.vue";
import Button from "@/components/shared/Button.vue";
</script>

<template>
  <div class="mission-page">
    <div class="mission-head">
      <Logo />
      <BackIcon to="/" />
    </div>
    <LongBackground>
      <div class="mission-btn">
        <Button text="مرحله بعد" to="cardselection" />
      </div>
    </LongBackground>
  </div>
</template>

<style scoped></style>
