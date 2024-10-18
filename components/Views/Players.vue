<script setup>
import { onMounted, ref } from "vue";
import CardBack from "~/assets/img/card-back.svg";
import AddPlus from "~/assets/img/add-plus.svg";
import { usePlayers } from "~/stores/usePlayers";

const players = usePlayers();
const playerName = ref("");
const playerForm = ref(false);
const addPlayer = () => {
  players.addPlayer(playerName.value, false);
  playerForm.value = false;
  playerName.value = "";
};

const deletePlayer = (index) => {
  players.removePlayer(index);
};

const addPlusSrc = ref(null);

onMounted(() => {
  addPlusSrc.value = AddPlus;
});
</script>

<template>
  <div class="players-section">
    <div class="players-head">
      <div>بازیکنان</div>
      <div class="player-head-numbers">{{ players.playersStatus.length }}</div>
    </div>
    <div class="player-content">
      <div class="player-card" v-for="(player, index) in players.playersStatus">
        <img :src="CardBack" alt="" />
        <div class="player-name">{{ player.name }}</div>
        <div class="delete-player" @click="deletePlayer(index)">x</div>
      </div>
      <div class="add-player" @click="playerForm = !playerForm">
        <img :src="`${addPlusSrc || ''}`" alt="" />
      </div>
    </div>
    <div class="add-player-name" v-if="playerForm" @click.self="playerForm = !playerForm">
      <form @submit.prevent="addPlayer" class="player-form">
        <div>
          <input type="text" v-model="playerName" placeholder="نام بازیکن را وارد کنید" required />
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
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  font-size: 3rem;

}
.player-head-numbers {
  color: var(--player-color);
}
.player-content {
  display: flex;
  flex-direction: row-reverse;
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
  direction: rtl;
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
