import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { allWords, wordCategories } from "~/data/words";
import { useWords } from "~/stores/words";

describe("word data", () => {
  it("has no duplicate words", () => {
    expect(new Set(allWords).size).toBe(allWords.length);
  });

  it("has unique category ids and no empty categories", () => {
    const ids = wordCategories.map((category) => category.id);
    expect(new Set(ids).size).toBe(ids.length);
    wordCategories.forEach((category) => expect(category.words.length).toBeGreaterThan(0));
  });
});

describe("words store", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it("picks a word from the pool and reports its category", () => {
    const store = useWords();
    const { word, categoryId } = store.pickWord();

    expect(allWords).toContain(word);
    expect(wordCategories.find((category) => category.id === categoryId)?.words).toContain(word);
  });

  it("builds shuffled guess options with the word and decoys from its category", () => {
    const store = useWords();
    const options = store.guessOptions("قطار", "vehicles", 6);
    const vehicles = wordCategories.find((category) => category.id === "vehicles")!.words;

    expect(options).toHaveLength(6);
    expect(options).toContain("قطار");
    expect(new Set(options).size).toBe(6);
    options.forEach((option) => expect(vehicles).toContain(option));
  });

  it("fills guess options from other categories when a category is small", () => {
    const options = useWords().guessOptions("دست", "body", 6);

    expect(options).toHaveLength(6);
    expect(new Set(options).size).toBe(6);
  });

  it("limits the pool to the chosen categories", () => {
    const store = useWords();
    const vehicles = wordCategories.find((category) => category.id === "vehicles")!.words;

    for (let i = 0; i < 20; i++) expect(vehicles).toContain(store.pickWord(["vehicles"]).word);
  });

  it("does not repeat recent words", () => {
    const store = useWords();
    const poolSize = store.wordPool(["vehicles"]).length;
    const historySize = Math.floor(poolSize / 2);
    const picked = Array.from({ length: 30 }, () => store.pickWord(["vehicles"]).word);

    // Any window of `historySize + 1` consecutive picks has no repeats.
    for (let i = 0; i + historySize < picked.length; i++) {
      const window = picked.slice(i, i + historySize + 1);
      expect(new Set(window).size).toBe(window.length);
    }
  });
});
