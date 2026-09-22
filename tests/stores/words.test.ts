import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useWords } from "~/stores/words";

describe("words store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("picks a word from the list", () => {
    const store = useWords();
    store.pickRandomWord();

    expect(store.words).toContain(store.currentWord);
  });

  it("clears the current word on reset", () => {
    const store = useWords();
    store.pickRandomWord();
    store.reset();

    expect(store.currentWord).toBe("");
  });
});
