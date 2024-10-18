<script setup>
import { ref } from "vue";
import Logo from "@/components/shared/Logo.vue";
import LongBackground from "@/components/shared/LongBackground.vue";
import Button from "@/components/shared/Button.vue";
import CardBack from "~/assets/img/card-back.svg";
import { usePlayers } from "~/stores/usePlayers";
import { useGameWords } from "~/stores/useGameWords";
const players = usePlayers();
const GameWords = useGameWords();

const whoSpy = ref(false)
const resetData = () => {
  players.resetGame()
  GameWords.resetWord();
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
          <div class="player-info" v-for="(player, index) in players.playersStatus">
            <img :src="CardBack" alt="" />
            <div class="player-name">{{ player.name }}</div>
            <div class="status-player"
             :class="{'spy-player': player.spyCheck}"
             v-if="whoSpy">{{ player.spyCheck ? "جاسوس" : "شهروند" }}</div>
          </div>
        </div>
        <div class="show-spy" @click="whoSpy = true">جاسوس کیه؟</div>
      </div>
    </LongBackground>
    <div class="spyidentity-btn">
      <Button text="!پایان بازی" to="/" @click="resetData" />
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
  flex-direction: row-reverse;
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

.player-card {
  padding: 1rem;

}
.player-name, .status-player {
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
