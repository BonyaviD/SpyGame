<script setup lang="ts">
import { useGame } from "~/stores/game";
import type { RoundOutcome } from "~/types/game";

const game = useGame();

type OutcomeText = Record<RoundOutcome, { title: string; detail: string }>;

const ONE_SPY: OutcomeText = {
  "spies-escaped": {
    title: "جاسوس برد!",
    detail: "گروه به یک شهروند رأی داد و جاسوس فرار کرد.",
  },
  "spies-guessed": {
    title: "جاسوس برد!",
    detail: "جاسوس گیر افتاد اما کلمه را درست حدس زد.",
  },
  citizens: {
    title: "شهروندها بردند!",
    detail: "جاسوس گیر افتاد و کلمه را هم نتوانست حدس بزند.",
  },
};

const MANY_SPIES: OutcomeText = {
  "spies-escaped": {
    title: "جاسوس‌ها بردند!",
    detail: "گروه به یک شهروند رأی داد و جاسوس‌ها فرار کردند.",
  },
  "spies-guessed": {
    title: "جاسوس‌ها بردند!",
    detail: "جاسوس‌ها گیر افتادند اما کلمه را درست حدس زدند.",
  },
  citizens: {
    title: "شهروندها بردند!",
    detail: "جاسوس‌ها گیر افتادند و کلمه را هم نتوانستند حدس بزنند.",
  },
};

const outcome = computed(() => {
  const result = game.round?.outcome;
  if (!result) return null;
  return (game.spies.length > 1 ? MANY_SPIES : ONE_SPY)[result];
});
const spiesWon = computed(() => game.round?.outcome !== "citizens");

const roleOf = (playerId: string) => {
  if (game.isSpy(playerId)) return "جاسوس";
  return game.round?.accusedIds.includes(playerId) ? "شهروند (متهم)" : "شهروند";
};

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
    <div v-if="game.round && outcome" class="result">
      <div class="result__banner" :class="{ 'result__banner--spies': spiesWon }">
        <h2 class="result__title">{{ outcome.title }}</h2>
        <p class="result__detail">{{ outcome.detail }}</p>
      </div>

      <dl class="result__facts">
        <div>
          <dt>کلمه</dt>
          <dd>{{ game.round.word }}</dd>
        </div>
        <div v-if="game.round.spyGuess">
          <dt>حدس جاسوس</dt>
          <dd>{{ game.round.spyGuess }}</dd>
        </div>
      </dl>

      <ul class="result__players">
        <li v-for="player in game.round.players" :key="player.id">
          <PlayerCard
            :name="player.name"
            :role="roleOf(player.id)"
            :highlighted="game.isSpy(player.id)"
          />
        </li>
      </ul>

      <section class="result__scores" aria-labelledby="scores-title">
        <h3 id="scores-title" class="result__scores-title">امتیازها</h3>
        <Scoreboard :entries="game.leaderboard" :round-points="game.round.points" />
      </section>
    </div>

    <template #footer>
      <div class="result__actions">
        <AppButton block @click="newRound">دور جدید</AppButton>
        <AppButton variant="outline" block @click="editPlayers">تغییر بازیکنان و تنظیمات</AppButton>
      </div>
    </template>
  </ScreenLayout>
</template>

<style scoped>
.result {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
.result__banner {
  padding: var(--space-4);
  border: 2px solid var(--color-success);
  border-radius: var(--radius-lg);
  text-align: center;
}
.result__banner--spies {
  border-color: var(--color-primary);
}
.result__title {
  font-size: var(--font-size-2xl);
  font-weight: normal;
  color: var(--color-accent);
}
.result__detail {
  margin-top: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
.result__facts {
  display: flex;
  justify-content: center;
  gap: var(--space-8);
  text-align: center;
}
.result__facts dt {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
.result__facts dd {
  font-size: var(--font-size-xl);
  color: var(--color-accent);
}
.result__players {
  display: flex;
  gap: var(--space-3);
  padding-block: var(--space-2);
  overflow-x: auto;
}
.result__scores-title {
  margin-bottom: var(--space-3);
  font-size: var(--font-size-lg);
  font-weight: normal;
}
.result__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
</style>
