<script setup lang="ts">
import { MAX_NAME_LENGTH, MAX_PLAYERS } from "~/data/config";
import { usePlayers } from "~/stores/players";
import type { Player } from "~/types/game";
import { toFaDigits } from "~/utils/format";

const playersStore = usePlayers();

const isFormOpen = ref(false);
const playerName = ref("");
const nameError = ref<string>();
const nameInput = ref<{ focus: () => void }>();
const playerToRemove = ref<Player | null>(null);

const openForm = () => {
  playerName.value = "";
  nameError.value = undefined;
  isFormOpen.value = true;
};

// The dialog stays open so several players can be added in a row.
const addPlayer = () => {
  nameError.value = playersStore.addPlayer(playerName.value) ?? undefined;
  if (!nameError.value) playerName.value = "";
  if (playersStore.isFull) isFormOpen.value = false;
  else nameInput.value?.focus();
};

watch(playerName, () => {
  nameError.value = undefined;
});

const isConfirmOpen = computed({
  get: () => playerToRemove.value !== null,
  set: (open) => {
    if (!open) playerToRemove.value = null;
  },
});

const removePlayer = () => {
  if (playerToRemove.value) playersStore.removePlayer(playerToRemove.value.id);
};
</script>

<template>
  <section class="players" aria-labelledby="players-title">
    <header class="players__head">
      <h2 id="players-title" class="players__title">بازیکنان</h2>
      <span class="players__count">
        {{ toFaDigits(playersStore.players.length) }}
        <span class="players__max">/ {{ toFaDigits(MAX_PLAYERS) }}</span>
      </span>
    </header>

    <ul class="players__list">
      <li v-for="player in playersStore.players" :key="player.id">
        <PlayerCard :name="player.name" removable @remove="playerToRemove = player" />
      </li>
      <li v-if="!playersStore.isFull">
        <button type="button" class="players__add" aria-label="افزودن بازیکن" @click="openForm">
          <AppIcon name="plus" size="2rem" />
        </button>
      </li>
    </ul>

    <AppModal v-model:open="isFormOpen" title="بازیکن جدید">
      <form id="add-player-form" novalidate @submit.prevent="addPlayer">
        <AppInput
          ref="nameInput"
          v-model="playerName"
          label="نام بازیکن"
          hide-label
          placeholder="نام بازیکن را وارد کنید"
          :maxlength="MAX_NAME_LENGTH"
          :error="nameError"
        />
      </form>
      <template #actions>
        <AppButton variant="outline" size="md" @click="isFormOpen = false">تمام</AppButton>
        <AppButton type="submit" form="add-player-form" size="md">ثبت</AppButton>
      </template>
    </AppModal>

    <AppConfirm
      v-model:open="isConfirmOpen"
      :title="`${playerToRemove?.name ?? ''} حذف شود؟`"
      confirm-text="حذف"
      danger
      @confirm="removePlayer"
    />
  </section>
</template>

<style scoped>
.players {
  border-block: 2px solid var(--color-border);
}
.players__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: var(--space-3);
}
.players__title {
  font-size: var(--font-size-2xl);
  font-weight: normal;
}
.players__count {
  font-size: var(--font-size-2xl);
  color: var(--color-accent);
}
.players__max {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
.players__list {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-2) var(--space-5);
  overflow-x: auto;
}
.players__add {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6.5rem;
  aspect-ratio: var(--card-ratio);
  border: 2px dashed var(--color-border-strong);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  color: var(--color-text);
}
</style>
