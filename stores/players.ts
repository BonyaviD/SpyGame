import { defineStore } from "pinia";
import type { Player } from "~/types/game";

export const usePlayers = defineStore("players", () => {
  const players = ref<Player[]>([]);

  const addPlayer = (name: string) => {
    players.value.push({ name, isSpy: false });
  };

  const removePlayer = (index: number) => {
    players.value.splice(index, 1);
  };

  const assignRandomSpy = () => {
    players.value.forEach((player) => {
      player.isSpy = false;
    });
    const randomIndex = Math.floor(Math.random() * players.value.length);
    players.value[randomIndex].isSpy = true;
  };

  const reset = () => {
    players.value = [];
  };

  return { players, addPlayer, removePlayer, assignRandomSpy, reset };
});
