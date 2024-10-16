<script setup>
defineProps({
    srcBG: {
        type: String
    }
})
</script>

<template>
    <div class="short-background">
        <img :src="srcBG" alt="">
        <slot />
    </div>
</template>

<style scoped>
.short-background img {
position: fixed;
bottom: 0;

}
</style>