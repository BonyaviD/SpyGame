import { defineStore } from "pinia";
import { GUESS_OPTION_COUNT, WORD_HISTORY_SIZE } from "~/data/config";
import { allWords, wordCategories, type WordCategoryId } from "~/data/words";
import { persistedRef } from "~/utils/persisted";
import { randomItem, shuffle } from "~/utils/random";

const isStringList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const categoryOf = (word: string) =>
  wordCategories.find((category) => category.words.includes(word))!.id;

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
    return { word, categoryId: categoryOf(word) };
  };

  /**
   * Shuffled choices for a caught spy: the secret word plus decoys, taken from the same
   * category first so the answer isn't obvious, then from the rest of the words.
   */
  const guessOptions = (word: string, categoryId: WordCategoryId, count = GUESS_OPTION_COUNT) => {
    const sameCategory = shuffle(wordPool([categoryId]).filter((item) => item !== word));
    const others = shuffle(
      allWords.filter((item) => item !== word && !sameCategory.includes(item)),
    );
    const decoys = [...sameCategory, ...others].slice(0, count - 1);
    return shuffle([word, ...decoys]);
  };

  return { recentWords, wordPool, pickWord, guessOptions };
});
