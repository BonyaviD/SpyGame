<script setup>
import LongBG from '@/assets/background/long-background.svg'
</script>

<template>
    <div class="background">
        <img :src="LongBG" alt="">
        <slot />
    </div>
</template>

<style scoped>
.background img {
position: fixed;
bottom: 0;
}
</style>