<script setup lang="ts">
import type { Player } from "~/types/game";

const selected = defineModel<string[]>({ required: true });

const props = defineProps<{
  players: Player[];
  /** How many players can be selected at most. */
  max: number;
}>();

const toggle = (id: string) => {
  if (selected.value.includes(id)) {
    selected.value = selected.value.filter((item) => item !== id);
  } else if (props.max === 1) {
    selected.value = [id];
  } else if (selected.value.length < props.max) {
    selected.value = [...selected.value, id];
  }
};
</script>

<template>
  <ul class="picker">
    <li v-for="player in players" :key="player.id">
      <button
        type="button"
        class="picker__option"
        :class="{ 'picker__option--selected': selected.includes(player.id) }"
        :aria-pressed="selected.includes(player.id)"
        @click="toggle(player.id)"
      >
        <PlayerCard :name="player.name" />
      </button>
    </li>
  </ul>
</template>

<style scoped>
.picker {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(6.5rem, 1fr));
  justify-items: center;
  gap: var(--space-4) var(--space-3);
}
.picker__option {
  padding: var(--space-2);
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  transition:
    border-color var(--duration-fast) var(--ease-standard),
    transform var(--duration-fast) var(--ease-standard),
    opacity var(--duration-fast) var(--ease-standard);
}
.picker__option--selected {
  border-color: var(--color-primary);
  background-color: var(--color-surface);
  transform: scale(1.04);
}
</style>
