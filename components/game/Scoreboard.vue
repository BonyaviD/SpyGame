<script setup lang="ts">
import { toFaDigits } from "~/utils/format";

defineProps<{
  entries: { id: string; name: string; score: number }[];
  /** Points gained this round, shown next to the total. */
  roundPoints?: Record<string, number>;
}>();
</script>

<template>
  <ol class="scoreboard">
    <li v-for="(entry, index) in entries" :key="entry.id" class="scoreboard__row">
      <span class="scoreboard__rank">{{ toFaDigits(index + 1) }}</span>
      <span class="scoreboard__name">{{ entry.name }}</span>
      <span v-if="roundPoints?.[entry.id]" class="scoreboard__delta">
        +{{ toFaDigits(roundPoints[entry.id]) }}
      </span>
      <span class="scoreboard__score">{{ toFaDigits(entry.score) }}</span>
    </li>
  </ol>
</template>

<style scoped>
.scoreboard {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.scoreboard__row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
}
.scoreboard__rank {
  width: 1.5rem;
  color: var(--color-text-muted);
}
.scoreboard__name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.scoreboard__delta {
  font-size: var(--font-size-sm);
  color: var(--color-success);
}
.scoreboard__score {
  min-width: 2ch;
  font-size: var(--font-size-lg);
  color: var(--color-accent);
  text-align: end;
}
</style>
