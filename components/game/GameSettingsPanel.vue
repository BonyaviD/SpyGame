<script setup lang="ts">
import { MAX_ROUND_MINUTES, MIN_ROUND_MINUTES, PLAYERS_PER_SPY, maxSpiesFor } from "~/data/config";
import { wordCategories } from "~/data/words";
import { usePlayers } from "~/stores/players";
import { useSettings } from "~/stores/settings";
import { toFaDigits } from "~/utils/format";

const playersStore = usePlayers();
const settingsStore = useSettings();

const maxSpies = computed(() => maxSpiesFor(playersStore.players.length));

// Keep the saved spy count valid when players are removed.
watch(
  maxSpies,
  (max) => {
    if (settingsStore.settings.spyCount > max) settingsStore.settings.spyCount = max;
  },
  { immediate: true },
);
</script>

<template>
  <section class="settings" aria-labelledby="settings-title">
    <h2 id="settings-title" class="settings__title">تنظیمات بازی</h2>

    <AppCounter
      v-model="settingsStore.settings.spyCount"
      label="تعداد جاسوس"
      :min="1"
      :max="maxSpies"
    />
    <p v-if="maxSpies === 1" class="settings__hint">
      به‌ازای هر {{ toFaDigits(PLAYERS_PER_SPY) }} بازیکن یک جاسوس می‌شود اضافه کرد.
    </p>

    <AppCounter
      v-model="settingsStore.settings.roundMinutes"
      label="زمان بحث"
      unit="دقیقه"
      :min="MIN_ROUND_MINUTES"
      :max="MAX_ROUND_MINUTES"
    />

    <fieldset class="settings__categories">
      <legend class="settings__label">دسته‌بندی کلمات</legend>
      <div class="settings__chips">
        <AppChip
          v-for="category in wordCategories"
          :key="category.id"
          :pressed="settingsStore.isCategorySelected(category.id)"
          @click="settingsStore.toggleCategory(category.id)"
        >
          {{ category.label }}
        </AppChip>
      </div>
    </fieldset>
  </section>
</template>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding-block: var(--space-5);
}
.settings__title {
  font-size: var(--font-size-xl);
  font-weight: normal;
  color: var(--color-accent);
}
.settings__hint {
  margin-top: calc(var(--space-2) * -1);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}
.settings__categories {
  border: none;
}
.settings__label {
  margin-bottom: var(--space-3);
  font-size: var(--font-size-lg);
}
.settings__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
</style>
