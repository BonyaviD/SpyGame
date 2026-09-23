<script setup lang="ts">
import { SPY_CARD_TEXT } from "~/data/config";
import { useGame } from "~/stores/game";
import { unlockAudio } from "~/utils/alarm";
import { toFaDigits } from "~/utils/format";

const game = useGame();
const router = useRouter();

/**
 * "handoff": asks to pass the phone to the current player, so nobody sees someone else's card.
 * "card": the current player is holding the phone and can open their card.
 * Not persisted: after a reload it's safest to start again from the handoff screen.
 */
const stage = ref<"handoff" | "card">("handoff");
const isCardOpen = ref(false);
/**
 * Text on the open card. Kept separately from the current player so that when the card is
 * closed and the turn moves on, the next player never sees the previous card while it flips.
 */
const cardText = ref("");

const totalPlayers = computed(() => game.round?.players.length ?? 0);
const turnNumber = computed(() => (game.round?.revealedCount ?? 0) + 1);

const onCardClick = () => {
  const player = game.currentPlayer;
  if (!player || !game.round) return;

  if (isCardOpen.value) {
    cardText.value = "";
    isCardOpen.value = false;
    game.markCurrentRevealed();
    stage.value = "handoff";
  } else {
    cardText.value = game.isSpy(player.id) ? SPY_CARD_TEXT : game.round.word;
    isCardOpen.value = true;
  }
};

const startDiscussion = async () => {
  // This click is the user gesture browsers require before the timer alarm can play.
  unlockAudio();
  game.startDiscussion();
  await navigateTo("/discussion");
};

// Leaving while cards are being dealt cancels the round, so ask first.
// Moving on to the discussion or peeking at the guide keeps the round.
const ROUTES_KEEPING_ROUND = ["/discussion", "/guide"];
const pendingRoute = ref<string | null>(null);
const isLeaveConfirmOpen = computed({
  get: () => pendingRoute.value !== null,
  set: (open) => {
    if (!open) pendingRoute.value = null;
  },
});

onBeforeRouteLeave((to) => {
  if (game.phase !== "reveal" || ROUTES_KEEPING_ROUND.includes(to.path)) return true;
  pendingRoute.value = to.fullPath;
  return false;
});

const leaveGame = async () => {
  const target = pendingRoute.value ?? "/setup";
  game.abortRound();
  await router.push(target);
};
</script>

<template>
  <ScreenLayout back="/setup" help>
    <div v-if="game.currentPlayer && stage === 'handoff'" class="reveal reveal--center">
      <p class="reveal__progress">
        کارت {{ toFaDigits(turnNumber) }} از {{ toFaDigits(totalPlayers) }}
      </p>
      <h2 class="reveal__turn">
        گوشی را به
        <span class="reveal__player">{{ game.currentPlayer.name }}</span>
        بده
      </h2>
      <p class="reveal__hint">بقیه نگاه نکنند!</p>
      <AppButton size="md" @click="stage = 'card'">
        من {{ game.currentPlayer.name }} هستم
      </AppButton>
    </div>

    <div v-else-if="game.currentPlayer" class="reveal">
      <h2 class="reveal__turn">
        کارت
        <span class="reveal__player">{{ game.currentPlayer.name }}</span>
      </h2>

      <FlipCard
        class="reveal__card"
        :flipped="isCardOpen"
        :label="isCardOpen ? 'بستن کارت' : 'دیدن کارت'"
        @click="onCardClick"
      >
        <template #front>
          <CardBack />
        </template>
        <template #back>
          <span
            class="reveal__word"
            :class="{ 'reveal__word--spy': cardText === SPY_CARD_TEXT }"
            aria-live="polite"
          >
            {{ cardText }}
          </span>
        </template>
      </FlipCard>

      <p class="reveal__hint">
        {{
          isCardOpen
            ? "کلمه را به خاطر بسپار و دوباره روی کارت بزن تا بسته شود."
            : "روی کارت بزن تا کلمه‌ات را ببینی."
        }}
      </p>
    </div>

    <div v-else class="reveal reveal--center">
      <h2 class="reveal__turn">همه کارت‌شان را دیدند</h2>
      <p class="reveal__hint">گوشی را وسط بگذارید و بحث را شروع کنید.</p>
    </div>

    <template #footer>
      <AppButton :disabled="!game.allRevealed" block @click="startDiscussion">شروع بحث</AppButton>
    </template>

    <AppConfirm
      v-model:open="isLeaveConfirmOpen"
      title="بازی لغو شود؟"
      message="کارت‌های این دور از بین می‌روند و باید دوباره پخش شوند."
      confirm-text="لغو بازی"
      cancel-text="ادامه"
      danger
      @confirm="leaveGame"
    />
  </ScreenLayout>
</template>

<style scoped>
.reveal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
}
.reveal--center {
  justify-content: center;
  height: 100%;
  text-align: center;
}
.reveal__turn {
  font-size: var(--font-size-2xl);
  font-weight: normal;
  line-height: var(--line-height-body);
}
.reveal__player {
  color: var(--color-accent);
}
.reveal__progress,
.reveal__hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-align: center;
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
