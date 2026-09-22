<script setup lang="ts">
import { usePlayers } from "~/stores/players";

const playersStore = usePlayers();
</script>

<template>
  <ScreenLayout back="/">
    <PlayerList />

    <template #footer>
      <AppButton to="/reveal" :disabled="!playersStore.players.length" block>مرحله بعد</AppButton>
    </template>
  </ScreenLayout>
</template>
