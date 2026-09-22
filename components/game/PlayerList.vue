<script setup lang="ts">
import cardBack from "~/assets/img/card-back.svg";
import addPlus from "~/assets/img/add-plus.svg";
import { usePlayers } from "~/stores/players";

const playersStore = usePlayers();
const playerName = ref("");
const isFormOpen = ref(false);

const addPlayer = () => {
  playersStore.addPlayer(playerName.value);
  isFormOpen.value = false;
  playerName.value = "";
};
</script>

<template>
  <div class="players-section">
    <div class="players-head">
      <div>بازیکنان</div>
      <div class="player-head-numbers">{{ playersStore.players.length }}</div>
    </div>
    <div class="player-content">
      <div v-for="(player, index) in playersStore.players" :key="index" class="player-card">
        <img :src="cardBack" alt="" />
        <div class="player-name">{{ player.name }}</div>
        <div class="delete-player" @click="playersStore.removePlayer(index)">x</div>
      </div>
      <div class="add-player" @click="isFormOpen = !isFormOpen">
        <img :src="addPlus" alt="" />
      </div>
    </div>
    <div v-if="isFormOpen" class="add-player-name" @click.self="isFormOpen = false">
      <form class="player-form" @submit.prevent="addPlayer">
        <div>
          <input v-model="playerName" type="text" placeholder="نام بازیکن را وارد کنید" required />
        </div>
        <button class="input-btn" type="submit">ثبت</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.players-section {
  border-top: 2px solid var(--border-card);
  border-bottom: 2px solid var(--border-card);
  color: var(--text-color);
  position: relative;
}
.players-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 3rem;
}
.player-head-numbers {
  color: var(--player-color);
}
.player-content {
  display: flex;
  align-items: start;
  gap: 0 0.5rem;
  padding: 2rem 0.5rem;
  overflow-x: scroll;
}
.add-player {
  position: relative;
  top: 1rem;
  min-width: 10rem;
  height: 12.5rem;
  border: 2px dotted var(--light-border-card);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--background-card);
  border-radius: 8px;
}
.add-player img {
  width: 2.5rem;
}

.player-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.player-card img {
  width: 10rem;
  height: 14rem;
}
.player-name {
  font-size: 2rem;
}
.delete-player {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--light-border-card);
  color: var(--background-card);
  border-radius: 100%;
  font-size: 1.5rem;
}
.add-player-name {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.player-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
  background-color: var(--background-card);
  border-radius: 8px;
}
.player-form input {
  background-color: inherit;
  border-radius: 4px;
  padding: 1rem;
  outline: none;
  border: 1px solid var(--light-border-card);
  color: var(--text-color);
  font-family: cinema;
  font-size: 1.7rem;
}
.player-form input::placeholder {
  font-family: cinema;
  font-size: 1.7rem;
}

.input-btn {
  background-color: var(--background-btn);
  border: none;
  outline: none;
  padding: 0.5rem 3rem;
  border-radius: 4px;
  font-size: 2rem;
  font-family: cinema;
  color: var(--background-card);
}
</style>
