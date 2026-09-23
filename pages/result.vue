<script setup lang="ts">
import { useGame } from "~/stores/game";

const game = useGame();

const newRound = async () => {
  game.startRound();
  await navigateTo("/reveal");
};

const editPlayers = async () => {
  game.abortRound();
  await navigateTo("/setup");
};
</script>

<template>
  <ScreenLayout back="/" help>
    <div v-if="game.round" class="result">
      <h2 class="result__title">
        {{ game.round.isSpyRevealed ? "جاسوس لو رفت!" : "بازی شروع شد" }}
      </h2>
      <p v-if="game.round.isSpyRevealed" class="result__word">
        کلمه: <strong>{{ game.round.word }}</strong>
      </p>

      <ul class="result__players">
        <li v-for="player in game.round.players" :key="player.id">
          <PlayerCard
            :name="player.name"
            :role="
              game.round.isSpyRevealed ? (game.isSpy(player.id) ? 'جاسوس' : 'شهروند') : undefined
            "
            :highlighted="game.round.isSpyRevealed && game.isSpy(player.id)"
          />
        </li>
      </ul>

      <AppButton
        v-if="!game.round.isSpyRevealed"
        variant="outline"
        size="md"
        @click="game.revealSpy()"
      >
        جاسوس کیه؟
      </AppButton>
    </div>

    <template #footer>
      <div class="result__actions">
        <AppButton block @click="newRound">دور جدید</AppButton>
        <AppButton variant="outline" block @click="editPlayers">تغییر بازیکنان</AppButton>
      </div>
    </template>
  </ScreenLayout>
</template>

<style scoped>
.result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
}
.result__title {
  font-size: var(--font-size-2xl);
  font-weight: normal;
  color: var(--color-accent);
}
.result__word {
  font-size: var(--font-size-lg);
}
.result__word strong {
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
.result__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
</style>
