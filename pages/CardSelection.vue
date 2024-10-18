<script setup>
import { ref } from "vue";
import BackIcon from "@/components/shared/BackIcon.vue";
import Logo from "@/components/shared/Logo.vue";
import LongBackground from "@/components/shared/LongBackground.vue";
import CardBack from "~/assets/img/card-back.svg";
import Button from "@/components/shared/Button.vue";
import { usePlayers } from "~/stores/usePlayers";
import { useGameWords } from "~/stores/useGameWords";
const players = usePlayers();
const GameWords = useGameWords()



const playerIndex = ref(1)
const chosenWord = ref('')
const frontCard = ref(false)

const turnOnCard = () => {
  if(players.playersStatus[playerIndex.value - 1].spyCheck) {
    chosenWord.value = "جاسوس"
  } else {
    chosenWord.value = GameWords.wordGame
  }
  frontCard.value = !frontCard.value
  
}
const turnBackCard = () => {
  if(playerIndex.value < players.playersStatus.length) {
    playerIndex.value++
    frontCard.value = !frontCard.value
  } else {
    
  }
  
}

onMounted(()=>{
  playerIndex.value = 1
  GameWords.getRandomWord()
  players.setRandomSpyCheck()
})
</script>

<template>
  <div class="card-selection-page">
    <div class="card-selection-head">
      <Logo />
      <BackIcon to="/missionsetup" />
    </div>
    <LongBackground>
      <div class="card-selcetion-content">
        <div class="content-title">نوبت،<span class="player-name">{{ players?.playersStatus[playerIndex - 1]?.name }}</span></div>
        <div class="content-card" @click="turnOnCard" v-if="!frontCard"><img :src="CardBack" alt="" /></div>
        <div class="chosen-card" @click="turnBackCard" v-else>{{ chosenWord }}</div>
      </div>
    </LongBackground>
    <div class="card-selection-btn">
      <Button text="شروع" to="/spyidentity" />
    </div>
  </div>
</template>

<style scoped>
.card-selcetion-content {
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
