<script setup lang="ts">
import { usePlayers } from "~/stores/players";
import { useWords } from "~/stores/words";

const SPY_CARD_TEXT = "جاسوس";

const playersStore = usePlayers();
const wordsStore = useWords();

const playerIndex = ref(1);
const chosenWord = ref("");
const frontCard = ref(false);

const currentPlayer = computed(() => playersStore.players[playerIndex.value - 1]);

const turnOnCard = () => {
  chosenWord.value = currentPlayer.value.isSpy ? SPY_CARD_TEXT : wordsStore.currentWord;
  frontCard.value = true;
};

const turnBackCard = () => {
  if (playerIndex.value < playersStore.players.length) {
    // Clear right away so the word is not visible while the card flips back for the next player.
    chosenWord.value = "";
    playerIndex.value++;
    frontCard.value = false;
  }
};

const onCardClick = () => (frontCard.value ? turnBackCard() : turnOnCard());

onMounted(() => {
  playerIndex.value = 1;
  wordsStore.pickRandomWord();
  playersStore.assignRandomSpy();
});
</script>

<template>
  <ScreenLayout back="/setup">
    <div class="reveal">
      <h2 class="reveal__turn">
        نوبت،
        <span class="reveal__player">{{ currentPlayer?.name }}</span>
      </h2>

      <FlipCard
        class="reveal__card"
        :flipped="frontCard"
        :label="frontCard ? 'پنهان کردن کارت' : 'دیدن کارت'"
        @click="onCardClick"
      >
        <template #front>
          <CardBack />
        </template>
        <template #back>
          <span class="reveal__word" :class="{ 'reveal__word--spy': chosenWord === SPY_CARD_TEXT }">
            {{ chosenWord }}
          </span>
        </template>
      </FlipCard>
    </div>

    <template #footer>
      <AppButton to="/result" block>شروع</AppButton>
    </template>
  </ScreenLayout>
</template>

<style scoped>
.reveal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
}
.reveal__turn {
  font-size: var(--font-size-2xl);
  font-weight: normal;
}
.reveal__player {
  color: var(--color-accent);
}
.reveal__card {
  width: min(13rem, 60%);
}
.reveal__word {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: var(--space-4);
  border: 2px solid var(--color-surface-raised);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  font-size: var(--font-size-3xl);
  text-align: center;
  overflow-wrap: anywhere;
}
.reveal__word--spy {
  color: var(--color-accent);
}
</style>
