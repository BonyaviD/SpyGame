<script setup lang="ts">
import { useGame } from "~/stores/game";
import { playAlarm, unlockAudio } from "~/utils/alarm";
import { toFaDigits } from "~/utils/format";

const game = useGame();

const { remainingMs, progress, isTimeUp } = useCountdown(playAlarm);

const toggleTimer = () => {
  unlockAudio();
  if (game.isTimerRunning) game.pauseTimer();
  else game.resumeTimer();
};

const isVoteConfirmOpen = ref(false);

const goToVote = async () => {
  game.startVoting();
  await navigateTo("/voting");
};

// Voting early (before the time is up) is allowed, but asked for first.
const requestVote = () => {
  if (isTimeUp.value) void goToVote();
  else isVoteConfirmOpen.value = true;
};
</script>

<template>
  <ScreenLayout back="/" help>
    <div v-if="game.round" class="discussion">
      <p class="discussion__starter">
        اولین سؤال را
        <strong>{{ game.starter?.name }}</strong>
        می‌پرسد
      </p>

      <CountdownRing
        :remaining-ms="remainingMs"
        :progress="progress"
        :paused="!game.isTimerRunning"
      />

      <AppButton v-if="!isTimeUp" variant="outline" size="md" @click="toggleTimer">
        {{ game.isTimerRunning ? "توقف زمان" : "ادامه‌ی زمان" }}
      </AppButton>

      <p class="discussion__hint">
        به نوبت از هم سؤال بپرسید. تعداد جاسوس‌ها:
        {{ toFaDigits(game.round.spyIds.length) }}
      </p>
    </div>

    <template #footer>
      <AppButton block @click="requestVote">رأی‌گیری</AppButton>
    </template>

    <AppConfirm
      v-model:open="isVoteConfirmOpen"
      title="رأی‌گیری زودتر شروع شود؟"
      message="زمان بحث هنوز تمام نشده است."
      confirm-text="رأی‌گیری"
      cancel-text="ادامه‌ی بحث"
      @confirm="goToVote"
    />
  </ScreenLayout>
</template>

<style scoped>
.discussion {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
}
.discussion__starter {
  font-size: var(--font-size-lg);
  text-align: center;
}
.discussion__starter strong {
  font-weight: normal;
  color: var(--color-accent);
}
.discussion__hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-align: center;
  line-height: var(--line-height-body);
}
</style>
