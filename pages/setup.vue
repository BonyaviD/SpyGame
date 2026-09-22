<script setup lang="ts">
import BackIcon from "~/components/shared/BackIcon.vue";
import Logo from "~/components/shared/Logo.vue";
import LongBackground from "~/components/shared/LongBackground.vue";
import Button from "~/components/shared/Button.vue";
import PlayerList from "~/components/game/PlayerList.vue";
import { usePlayers } from "~/stores/players";

const playersStore = usePlayers();
</script>

<template>
  <div class="mission-page">
    <div class="mission-head">
      <Logo />
      <BackIcon to="/" />
    </div>
    <LongBackground>
      <div class="mission-content">
        <PlayerList />
      </div>
    </LongBackground>
    <div class="mission-btn" :class="{ disable: !playersStore.players.length }">
      <Button text="مرحله بعد" to="/reveal" />
    </div>
  </div>
</template>

<style scoped>
.mission-btn {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 2rem 0;
}
.disable {
  opacity: 0;
}
.mission-content {
  padding: 0 2rem;
  height: 50vh;
}
</style>
