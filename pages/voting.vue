<script setup lang="ts">
import { useGame } from "~/stores/game";
import { toFaDigits } from "~/utils/format";

const game = useGame();

const suspects = ref<string[]>([]);
const guess = ref<string | null>(null);
const isVoteConfirmOpen = ref(false);
const isGuessConfirmOpen = ref(false);

const hasVoted = computed(() => !!game.round?.accusedIds.length);
const suspectNames = computed(() =>
  game.round?.players
    .filter((player) => suspects.value.includes(player.id))
    .map((player) => player.name)
    .join(" و "),
);
const spyNames = computed(() => game.spies.map((player) => player.name).join(" و "));
const manySpies = computed(() => game.suspectCount > 1);

const castVote = () => {
  game.castVote(suspects.value);
  // A wrong accusation ends the round immediately.
  if (game.phase === "result") void navigateTo("/result");
};

const submitGuess = async () => {
  if (!guess.value) return;
  game.submitGuess(guess.value);
  await navigateTo("/result");
};
</script>

<template>
  <ScreenLayout back="/" help>
    <div v-if="game.round && !hasVoted" class="voting">
      <h2 class="voting__title">
        {{ manySpies ? `${toFaDigits(game.suspectCount)} جاسوس` : "جاسوس" }} کیست؟
      </h2>
      <p class="voting__hint">
        با هم تصمیم بگیرید و
        {{ manySpies ? `${toFaDigits(game.suspectCount)} نفر` : "یک نفر" }}
        را انتخاب کنید.
      </p>
      <PlayerPicker v-model="suspects" :players="game.round.players" :max="game.suspectCount" />
    </div>

    <div v-else-if="game.round" class="voting">
      <h2 class="voting__title">
        {{ manySpies ? "جاسوس‌ها گیر افتادند!" : "جاسوس گیر افتاد!" }}
      </h2>
      <p class="voting__hint">
        <strong>{{ spyNames }}</strong
        >،
        {{
          manySpies
            ? "آخرین شانس: با هم کلمه‌ی مخفی را حدس بزنید. اگر درست بگویید، باز هم برنده‌اید."
            : "آخرین شانس: کلمه‌ی مخفی را حدس بزن. اگر درست بگویی، باز هم برنده‌ای."
        }}
      </p>
      <div class="voting__options" role="group" aria-label="حدس جاسوس">
        <AppChip
          v-for="option in game.round.guessOptions"
          :key="option"
          :pressed="guess === option"
          @click="guess = option"
        >
          {{ option }}
        </AppChip>
      </div>
    </div>

    <template #footer>
      <AppButton
        v-if="!hasVoted"
        :disabled="suspects.length !== game.suspectCount"
        block
        @click="isVoteConfirmOpen = true"
      >
        ثبت رأی
      </AppButton>
      <AppButton v-else :disabled="!guess" block @click="isGuessConfirmOpen = true">
        ثبت حدس
      </AppButton>
    </template>

    <AppConfirm
      v-model:open="isVoteConfirmOpen"
      :title="`رأی به ${suspectNames}؟`"
      message="بعد از ثبت، رأی قابل تغییر نیست."
      confirm-text="ثبت رأی"
      @confirm="castVote"
    />
    <AppConfirm
      v-model:open="isGuessConfirmOpen"
      :title="`حدس نهایی: ${guess ?? ''}؟`"
      confirm-text="ثبت حدس"
      @confirm="submitGuess"
    />
  </ScreenLayout>
</template>

<style scoped>
.voting {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  text-align: center;
}
.voting__title {
  font-size: var(--font-size-2xl);
  font-weight: normal;
  color: var(--color-accent);
}
.voting__hint {
  font-size: var(--font-size-md);
  color: var(--color-text-muted);
  line-height: var(--line-height-body);
}
.voting__hint strong {
  font-weight: normal;
  color: var(--color-text);
}
.voting__options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
  width: 100%;
  padding-top: var(--space-2);
}
.voting__options > * {
  min-height: var(--touch-target);
  font-size: var(--font-size-lg);
}
</style>
