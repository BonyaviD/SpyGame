import { defineStore } from "pinia";
import { ref } from "vue";

export const usePlayers = defineStore("players", () => {
  const playersStatus = ref([]);

  const addPlayer = (name, spyCheck) => {
    playersStatus.value.push({ name, spyCheck });
  };

  const removePlayer = (index) => {
    playersStatus.value.splice(index, 1);
  };

  const setRandomSpyCheck = () => {
    playersStatus.value.forEach((player)=>{
      player.spyCheck = false
    })
    const randomIndex = Math.floor(Math.random() * playersStatus.value.length);
    playersStatus.value[randomIndex].spyCheck = true;
};

  return { playersStatus, addPlayer, removePlayer, setRandomSpyCheck };
});
