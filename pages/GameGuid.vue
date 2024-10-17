<script setup>
import BackIcon from "@/components/shared/BackIcon.vue";
import LongBackground from "@/components/shared/LongBackground.vue";
import { useRules } from "@/stores/useRules.js";
const rules = useRules();

const changeRule = (index) => {
  rules.rulesInfo.forEach((rule) => {
    rule.active = false;
  });
  rules.rulesInfo[index].active = true;
};
</script>

<template>
  <div class="guid-page">
    <div class="guid-head">
      <BackIcon to="/" />
      <p class="guid-title">راهنمای بازی</p>
    </div>
    <LongBackground>
      <div class="guid-content">
        <div class="content-titles">
          <div class="content-title" v-for="(rule, index) in rules.rulesInfo" :class="{ active: rule.active }" @click="changeRule(index)">
            {{ rule.name }}
          </div>
        </div>
        <div class="content-description" v-for="(rule, index) in rules.rulesInfo">
          <div class="description-title" v-if="rule.active">{{ rule.title }}</div>
          <div class="description" v-if="rule.active">{{ rule.description }}</div>
        </div>
      </div>
    </LongBackground>
  </div>
</template>

<style scoped>
.guid-head {
  position: relative;
}
.guid-title {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 4rem;
  color: var(--text-color);
  margin-top: 3rem;
}

.guid-content {
  width: 100%;
  height: 100%;
  margin-top: 12rem;
  color: var(--text-color);
}

.content-titles {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1rem 0;
  font-size: 2rem;
}

.active {
  border-bottom: 2px solid var(--border-btn);
}
.content-description {
  direction: rtl;
  padding: 0 3rem;
  margin-top: 2rem;
}

.description-title {
  font-size: 3rem;
}

.description {
  font-size: 2rem;
  margin-top: 1.5rem;
}
</style>
