import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { MAX_NAME_LENGTH, MAX_PLAYERS } from "~/data/config";
import { normalizeName, usePlayers } from "~/stores/players";

describe("players store", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it("adds players with unique ids and removes them by id", () => {
    const store = usePlayers();
    store.addPlayer("علی");
    store.addPlayer("سارا");
    const [ali, sara] = store.players;

    expect(ali.id).not.toBe(sara.id);
    store.removePlayer(ali.id);
    expect(store.players.map((player) => player.name)).toEqual(["سارا"]);
  });

  it("rejects empty and whitespace-only names", () => {
    const store = usePlayers();

    expect(store.addPlayer("")).toBeTruthy();
    expect(store.addPlayer("   ")).toBeTruthy();
    expect(store.players).toHaveLength(0);
  });

  it("rejects duplicate names, including Arabic letter variants and extra spaces", () => {
    const store = usePlayers();
    store.addPlayer("علی");

    expect(store.addPlayer(" علي ")).toBe("این نام قبلاً ثبت شده است.");
    expect(store.players).toHaveLength(1);
  });

  it("rejects names longer than the limit", () => {
    const store = usePlayers();

    expect(store.addPlayer("ا".repeat(MAX_NAME_LENGTH + 1))).toBeTruthy();
    expect(store.addPlayer("ا".repeat(MAX_NAME_LENGTH))).toBeNull();
  });

  it("stops at the maximum number of players", () => {
    const store = usePlayers();
    for (let i = 0; i < MAX_PLAYERS; i++) store.addPlayer(`بازیکن ${i}`);

    expect(store.isFull).toBe(true);
    expect(store.addPlayer("اضافه")).toBeTruthy();
    expect(store.players).toHaveLength(MAX_PLAYERS);
  });

  it("restores players after a reload", () => {
    usePlayers().addPlayer("علی");

    setActivePinia(createPinia());
    expect(usePlayers().players.map((player) => player.name)).toEqual(["علی"]);
  });

  it("normalizes names", () => {
    expect(normalizeName("  كريم   رضا ")).toBe("کریم رضا");
  });
});
