<script setup lang="ts">
import { MIN_PLAYERS } from "~/data/config";
import { useGame } from "~/stores/game";
import { usePlayers } from "~/stores/players";
import { toFaDigits } from "~/utils/format";

const playersStore = usePlayers();
const game = useGame();

const missingPlayers = computed(() => MIN_PLAYERS - playersStore.players.length);

const startRound = async () => {
  game.startRound();
  await navigateTo("/reveal");
};
</script>

<template>
  <ScreenLayout back="/" help>
    <PlayerList />

    <template #footer>
      <p v-if="missingPlayers > 0" class="setup-hint" role="status">
        حداقل {{ toFaDigits(MIN_PLAYERS) }} بازیکن لازم است؛ {{ toFaDigits(missingPlayers) }} نفر
        دیگر اضافه کنید.
      </p>
      <AppButton :disabled="!playersStore.hasEnough" block @click="startRound">
        مرحله بعد
      </AppButton>
    </template>
  </ScreenLayout>
</template>

<style scoped>
.setup-hint {
  margin-bottom: var(--space-3);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-align: center;
}
</style>
