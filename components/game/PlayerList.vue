<script setup lang="ts">
import { usePlayers } from "~/stores/players";

const playersStore = usePlayers();
const playerName = ref("");
const isFormOpen = ref(false);

const addPlayer = () => {
  const name = playerName.value.trim();
  if (!name) return;
  playersStore.addPlayer(name);
  isFormOpen.value = false;
  playerName.value = "";
};
</script>

<template>
  <section class="players" aria-labelledby="players-title">
    <header class="players__head">
      <h2 id="players-title" class="players__title">بازیکنان</h2>
      <span class="players__count" aria-label="تعداد بازیکنان">
        {{ playersStore.players.length }}
      </span>
    </header>

    <ul class="players__list">
      <li v-for="(player, index) in playersStore.players" :key="index">
        <PlayerCard :name="player.name" removable @remove="playersStore.removePlayer(index)" />
      </li>
      <li>
        <button
          type="button"
          class="players__add"
          aria-label="افزودن بازیکن"
          @click="isFormOpen = true"
        >
          <AppIcon name="plus" size="2rem" />
        </button>
      </li>
    </ul>

    <AppModal v-model:open="isFormOpen" title="بازیکن جدید">
      <form id="add-player-form" @submit.prevent="addPlayer">
        <AppInput
          v-model="playerName"
          label="نام بازیکن"
          hide-label
          placeholder="نام بازیکن را وارد کنید"
        />
      </form>
      <template #actions>
        <AppButton type="submit" form="add-player-form" size="md">ثبت</AppButton>
      </template>
    </AppModal>
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
