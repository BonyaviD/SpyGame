import { defineStore } from "pinia";
import { WORD_HISTORY_SIZE } from "~/data/config";
import { wordCategories, type WordCategoryId } from "~/data/words";
import { persistedRef } from "~/utils/persisted";
import { randomItem } from "~/utils/random";

const isStringList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

export const useWords = defineStore("words", () => {
  /** Recently used words, newest last; avoided when picking the next word. */
  const recentWords = persistedRef<string[]>("recent-words", [], isStringList);

  const wordPool = (categoryIds?: WordCategoryId[]) => {
    const categories = categoryIds?.length
      ? wordCategories.filter((category) => categoryIds.includes(category.id))
      : wordCategories;
    return [...new Set(categories.flatMap((category) => category.words))];
  };

  /** Picks a random word that was not used in recent rounds, and records it. */
  const pickWord = (categoryIds?: WordCategoryId[]) => {
    const pool = wordPool(categoryIds);
    const fresh = pool.filter((word) => !recentWords.value.includes(word));
    const word = randomItem(fresh.length ? fresh : pool);

    const historySize = Math.min(WORD_HISTORY_SIZE, Math.floor(pool.length / 2));
    recentWords.value = [...recentWords.value.filter((item) => item !== word), word].slice(
      -historySize,
    );
    return word;
  };

  return { recentWords, wordPool, pickWord };
});
