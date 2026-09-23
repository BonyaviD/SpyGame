<script setup lang="ts">
import { useGame } from "~/stores/game";
import { routeForPhase } from "~/utils/routes";

const game = useGame();

const continueRoute = computed(() => (game.phase === "idle" ? null : routeForPhase(game.phase)));
</script>

<template>
  <ScreenLayout variant="compact">
    <template #header>
      <AppLogo with-text size="lg" />
    </template>

    <nav class="home-actions" aria-label="منوی اصلی">
      <AppButton v-if="continueRoute" :to="continueRoute" block>ادامه‌ی بازی</AppButton>
      <AppButton to="/guide" variant="outline" block>راهنمای بازی؟</AppButton>
      <AppButton to="/setup" :variant="continueRoute ? 'outline' : 'primary'" block>
        {{ continueRoute ? "بازی جدید" : "شروع بازی!" }}
      </AppButton>
    </nav>

    <template #footer>
      <AppCredit />
    </template>
  </ScreenLayout>
</template>

<style scoped>
.home-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding-top: var(--space-6);
}
</style>
