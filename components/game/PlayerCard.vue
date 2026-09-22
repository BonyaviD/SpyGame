<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string;
    /** Shows a remove button on the card. */
    removable?: boolean;
    /** Optional role label shown under the name (e.g. after the reveal). */
    role?: string;
    highlighted?: boolean;
  }>(),
  { removable: false, role: undefined, highlighted: false },
);

defineEmits<{ remove: [] }>();
</script>

<template>
  <figure class="player-card">
    <div class="player-card__art">
      <CardBack />
      <AppIconButton
        v-if="removable"
        class="player-card__remove"
        icon="close"
        :label="`حذف ${name}`"
        variant="solid"
        size="1rem"
        @click="$emit('remove')"
      />
    </div>
    <figcaption class="player-card__caption">
      <span class="player-card__name">{{ name }}</span>
      <span
        v-if="role"
        class="player-card__role"
        :class="{ 'player-card__role--highlighted': highlighted }"
      >
        {{ role }}
      </span>
    </figcaption>
  </figure>
</template>

<style scoped>
.player-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  width: 6.5rem;
  flex-shrink: 0;
}
.player-card__art {
  position: relative;
  width: 100%;
}
.player-card__remove {
  position: absolute;
  top: calc(var(--space-2) * -1);
  inset-inline-end: calc(var(--space-2) * -1);
}
.player-card__caption {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  max-width: 100%;
}
.player-card__name {
  max-width: 100%;
  overflow: hidden;
  font-size: var(--font-size-md);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.player-card__role {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
.player-card__role--highlighted {
  color: var(--color-accent);
}
</style>
