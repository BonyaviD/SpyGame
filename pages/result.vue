<script setup lang="ts">
import { usePlayers } from "~/stores/players";
import { useWords } from "~/stores/words";

const playersStore = usePlayers();
const wordsStore = useWords();

const isSpyRevealed = ref(false);

const endGame = async () => {
  playersStore.reset();
  wordsStore.reset();
  await navigateTo("/");
};
</script>

<template>
  <ScreenLayout>
    <div class="result">
      <h2 class="result__title">بازی شروع شد</h2>

      <ul class="result__players">
        <li v-for="(player, index) in playersStore.players" :key="index">
          <PlayerCard
            :name="player.name"
            :role="isSpyRevealed ? (player.isSpy ? 'جاسوس' : 'شهروند') : undefined"
            :highlighted="player.isSpy"
          />
        </li>
      </ul>

      <AppButton variant="outline" size="md" @click="isSpyRevealed = true">جاسوس کیه؟</AppButton>
    </div>

    <template #footer>
      <AppButton block @click="endGame">پایان بازی!</AppButton>
    </template>
  </ScreenLayout>
</template>

<style scoped>
.result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
}
.result__title {
  font-size: var(--font-size-2xl);
  font-weight: normal;
  color: var(--color-accent);
}
.result__players {
  display: flex;
  gap: var(--space-3);
  width: 100%;
  padding-block: var(--space-2);
  overflow-x: auto;
}
</style>
