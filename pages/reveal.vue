<script setup lang="ts">
import BackIcon from "~/components/shared/BackIcon.vue";
import Logo from "~/components/shared/Logo.vue";
import LongBackground from "~/components/shared/LongBackground.vue";
import Button from "~/components/shared/Button.vue";
import cardBack from "~/assets/img/card-back.svg";
import { usePlayers } from "~/stores/players";
import { useWords } from "~/stores/words";

const playersStore = usePlayers();
const wordsStore = useWords();

const playerIndex = ref(1);
const chosenWord = ref("");
const frontCard = ref(false);

const turnOnCard = () => {
  if (playersStore.players[playerIndex.value - 1].isSpy) {
    chosenWord.value = "جاسوس";
  } else {
    chosenWord.value = wordsStore.currentWord;
  }
  frontCard.value = !frontCard.value;
};

const turnBackCard = () => {
  if (playerIndex.value < playersStore.players.length) {
    playerIndex.value++;
    frontCard.value = !frontCard.value;
  }
};

onMounted(() => {
  playerIndex.value = 1;
  wordsStore.pickRandomWord();
  playersStore.assignRandomSpy();
});
</script>

<template>
  <div class="card-selection-page">
    <div class="card-selection-head">
      <Logo />
      <BackIcon to="/setup" />
    </div>
    <LongBackground>
      <div class="card-selection-content">
        <div class="content-title">
          نوبت،<span class="player-name">{{ playersStore.players[playerIndex - 1]?.name }}</span>
        </div>
        <div v-if="!frontCard" class="content-card" @click="turnOnCard">
          <img :src="cardBack" alt="" />
        </div>
        <div v-else class="chosen-card" @click="turnBackCard">{{ chosenWord }}</div>
      </div>
    </LongBackground>
    <div class="card-selection-btn">
      <Button text="شروع" to="/result" />
    </div>
  </div>
</template>

<style scoped>
.card-selection-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem 0;
}
.content-title {
  font-size: 2.5rem;
  color: var(--text-color);
}
.player-name {
  color: var(--player-color);
}

.content-card img {
  width: 20rem;
}

.chosen-card {
  position: relative;
  top: 1.4rem;
  width: 18rem;
  height: 25.5rem;
  border-radius: 8px;
  background-color: var(--background-card);
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}
.card-selection-btn {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 2rem 0;
}
</style>
