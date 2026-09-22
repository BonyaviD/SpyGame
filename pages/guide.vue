<script setup lang="ts">
import BackIcon from "~/components/shared/BackIcon.vue";
import LongBackground from "~/components/shared/LongBackground.vue";
import Button from "~/components/shared/Button.vue";
import { useRules } from "~/stores/rules";

const rulesStore = useRules();

const changeRule = (index: number) => {
  rulesStore.rules.forEach((rule) => {
    rule.active = false;
  });
  rulesStore.rules[index].active = true;
};
</script>

<template>
  <div class="guide-page">
    <div class="guide-head">
      <BackIcon to="/" />
      <p class="guide-title">راهنمای بازی</p>
    </div>
    <LongBackground>
      <div class="guide-content">
        <div class="content-titles">
          <div
            v-for="(rule, index) in rulesStore.rules"
            :key="rule.name"
            class="content-title"
            :class="{ active: rule.active }"
            @click="changeRule(index)"
          >
            {{ rule.name }}
          </div>
        </div>
        <div v-for="rule in rulesStore.rules" :key="rule.name" class="content-description">
          <div v-if="rule.active" class="description-title">{{ rule.title }}</div>
          <div v-if="rule.active" class="description">{{ rule.description }}</div>
        </div>
        <div class="guide-btn">
          <Button text="متوجه شدم" to="/" />
        </div>
      </div>
    </LongBackground>
  </div>
</template>

<style scoped>
.guide-head {
  position: relative;
}
.guide-title {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 4rem;
  color: var(--text-color);
  margin-top: 3rem;
}

.guide-content {
  width: 100%;
  height: 100%;
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
.guide-btn {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 2rem 0;
}
</style>
