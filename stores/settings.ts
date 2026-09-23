import { defineStore } from "pinia";
import { DEFAULT_ROUND_MINUTES, MAX_ROUND_MINUTES, MIN_ROUND_MINUTES } from "~/data/config";
import { wordCategories, type WordCategoryId } from "~/data/words";
import type { GameSettings } from "~/types/game";
import { persistedRef } from "~/utils/persisted";

const categoryIds = wordCategories.map((category) => category.id);

const defaults = (): GameSettings => ({
  spyCount: 1,
  roundMinutes: DEFAULT_ROUND_MINUTES,
  categories: [...categoryIds],
});

const isSettings = (value: unknown): value is GameSettings => {
  const settings = value as GameSettings;
  return (
    Number.isInteger(settings?.spyCount) &&
    settings.spyCount >= 1 &&
    Number.isInteger(settings.roundMinutes) &&
    settings.roundMinutes >= MIN_ROUND_MINUTES &&
    settings.roundMinutes <= MAX_ROUND_MINUTES &&
    Array.isArray(settings.categories) &&
    settings.categories.length > 0 &&
    settings.categories.every((id) => categoryIds.includes(id))
  );
};

export const useSettings = defineStore("settings", () => {
  const settings = persistedRef<GameSettings>("settings", defaults(), isSettings);

  const isCategorySelected = (id: WordCategoryId) => settings.value.categories.includes(id);

  /** Toggles a category; the last selected category cannot be turned off. */
  const toggleCategory = (id: WordCategoryId) => {
    const { categories } = settings.value;
    if (!categories.includes(id)) {
      settings.value.categories = categoryIds.filter(
        (item) => item === id || categories.includes(item),
      );
    } else if (categories.length > 1) {
      settings.value.categories = categories.filter((item) => item !== id);
    }
  };

  const reset = () => {
    settings.value = defaults();
  };

  return { settings, isCategorySelected, toggleCategory, reset };
});
