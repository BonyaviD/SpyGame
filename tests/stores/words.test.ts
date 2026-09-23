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

  it("picks a word from the pool", () => {
    const store = useWords();

    expect(allWords).toContain(store.pickWord());
  });

  it("limits the pool to the chosen categories", () => {
    const store = useWords();
    const vehicles = wordCategories.find((category) => category.id === "vehicles")!.words;

    for (let i = 0; i < 20; i++) expect(vehicles).toContain(store.pickWord(["vehicles"]));
  });

  it("does not repeat recent words", () => {
    const store = useWords();
    const poolSize = store.wordPool(["vehicles"]).length;
    const historySize = Math.floor(poolSize / 2);
    const picked = Array.from({ length: 30 }, () => store.pickWord(["vehicles"]));

    // Any window of `historySize + 1` consecutive picks has no repeats.
    for (let i = 0; i + historySize < picked.length; i++) {
      const window = picked.slice(i, i + historySize + 1);
      expect(new Set(window).size).toBe(window.length);
    }
  });
});
