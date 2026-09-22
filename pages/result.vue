<script setup lang="ts">
import Logo from "~/components/shared/Logo.vue";
import LongBackground from "~/components/shared/LongBackground.vue";
import Button from "~/components/shared/Button.vue";
import cardBack from "~/assets/img/card-back.svg";
import { usePlayers } from "~/stores/players";
import { useWords } from "~/stores/words";

const playersStore = usePlayers();
const wordsStore = useWords();

const isSpyRevealed = ref(false);

const resetData = () => {
  playersStore.reset();
  wordsStore.reset();
};
</script>

<template>
  <div class="spyidentity-page">
    <div class="spyidentity-head">
      <Logo />
    </div>
    <LongBackground>
      <div class="spyidentity-content">
        <div class="spyidentity-content-title">بازی شروع شد</div>
        <div class="spyidentity-content-players">
          <div v-for="(player, index) in playersStore.players" :key="index" class="player-info">
            <img :src="cardBack" alt="" />
            <div class="player-name">{{ player.name }}</div>
            <div v-if="isSpyRevealed" class="status-player" :class="{ 'spy-player': player.isSpy }">
              {{ player.isSpy ? "جاسوس" : "شهروند" }}
            </div>
          </div>
        </div>
        <div class="show-spy" @click="isSpyRevealed = true">جاسوس کیه؟</div>
      </div>
    </LongBackground>
    <div class="spyidentity-btn">
      <Button text="پایان بازی!" to="/" @click="resetData" />
    </div>
  </div>
</template>

<style scoped>
.spyidentity-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spyidentity-content-title {
  color: var(--player-color);
  font-size: 3rem;
}

.spyidentity-content-players {
  margin-top: 2rem;
  width: 100%;
  display: flex;
  gap: 0 0.5rem;
  overflow-x: scroll;
  padding: 1.5rem 0;
}
.player-info img {
  width: 10rem;
}
.player-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.player-name,
.status-player {
  color: var(--text-color);
  font-size: 1.8rem;
}
.spy-player {
  color: var(--player-color);
}
.show-spy {
  margin-top: 2rem;
  color: var(--text-color);
  font-size: 2rem;
  border: 2px solid var(--player-color);
  padding: 1rem 4rem;
  border-radius: 8px;
}
.spyidentity-btn {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 2rem 0;
}
</style>
