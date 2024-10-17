import { defineStore } from "pinia";

export const usePlayers = defineStore("players", () => {
  const playersStatus = ref([]);

  const addPlayer = (name, spyCheck) => {
    playersStatus.value.push({ name, spyCheck });
  };

const removePlayer = (index) => {
  playersStatus.value.splice(index, 1)

}

  return { playersStatus, addPlayer, removePlayer };
});
