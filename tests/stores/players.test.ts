import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { usePlayers } from "~/stores/players";

describe("players store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("adds and removes players", () => {
    const store = usePlayers();
    store.addPlayer("علی");
    store.addPlayer("سارا");
    store.removePlayer(0);

    expect(store.players).toEqual([{ name: "سارا", isSpy: false }]);
  });

  it("assigns exactly one spy", () => {
    const store = usePlayers();
    ["علی", "سارا", "رضا", "مریم"].forEach(store.addPlayer);

    for (let round = 0; round < 20; round++) {
      store.assignRandomSpy();
      expect(store.players.filter((player) => player.isSpy)).toHaveLength(1);
    }
  });

  it("clears all players on reset", () => {
    const store = usePlayers();
    store.addPlayer("علی");
    store.reset();

    expect(store.players).toEqual([]);
  });
});
