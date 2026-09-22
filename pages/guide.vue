<script setup lang="ts">
import { rules, type RuleId } from "~/data/rules";

const activeRule = ref<RuleId>("game");

const tabs = rules.map(({ id, name }) => ({ id, label: name }));
const currentRule = computed(() => rules.find((rule) => rule.id === activeRule.value)!);
</script>

<template>
  <ScreenLayout back="/" title="راهنمای بازی">
    <AppTabs v-model="activeRule" :tabs="tabs" label="بخش‌های راهنما">
      <article class="rule">
        <h2 class="rule__title">{{ currentRule.title }}</h2>
        <p class="rule__description">{{ currentRule.description }}</p>
      </article>
    </AppTabs>

    <template #footer>
      <AppButton to="/" block>متوجه شدم</AppButton>
      <AppCredit class="guide-credit" />
    </template>
  </ScreenLayout>
</template>

<style scoped>
.rule {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding-inline: var(--space-2);
}
.rule__title {
  font-size: var(--font-size-2xl);
  font-weight: normal;
}
.rule__description {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-body);
}
.guide-credit {
  margin-top: var(--space-4);
}
</style>
