import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { DEFAULT_ROUND_MINUTES, maxSpiesFor } from "~/data/config";
import { wordCategories } from "~/data/words";
import { useSettings } from "~/stores/settings";

describe("settings store", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it("starts with one spy, the default time and every category", () => {
    const { settings } = useSettings();

    expect(settings.spyCount).toBe(1);
    expect(settings.roundMinutes).toBe(DEFAULT_ROUND_MINUTES);
    expect(settings.categories).toHaveLength(wordCategories.length);
  });

  it("never turns off the last category", () => {
    const store = useSettings();
    wordCategories.forEach((category) => store.toggleCategory(category.id));

    expect(store.settings.categories).toHaveLength(1);
    store.toggleCategory(store.settings.categories[0]);
    expect(store.settings.categories).toHaveLength(1);
  });

  it("keeps categories in their display order when toggled back on", () => {
    const store = useSettings();
    store.toggleCategory("places");
    store.toggleCategory("places");

    expect(store.settings.categories).toEqual(wordCategories.map((category) => category.id));
  });

  it("restores saved settings and ignores invalid stored data", () => {
    useSettings().settings.roundMinutes = 7;
    setActivePinia(createPinia());
    expect(useSettings().settings.roundMinutes).toBe(7);

    localStorage.setItem("spy-game:v1:settings", JSON.stringify({ spyCount: 0 }));
    setActivePinia(createPinia());
    expect(useSettings().settings.spyCount).toBe(1);
  });

  it("allows one spy per three players, and at least one", () => {
    expect(maxSpiesFor(3)).toBe(1);
    expect(maxSpiesFor(5)).toBe(1);
    expect(maxSpiesFor(6)).toBe(2);
    expect(maxSpiesFor(20)).toBe(6);
  });
});
