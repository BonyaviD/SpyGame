import { defineStore } from "pinia";
import { ref, onMounted, onUnmounted } from "vue";

export const useResolationCheck = defineStore("resolation", () => {
  const isMobile = ref(true);

  function checkMobileMode() {
    isMobile.value = window.matchMedia("(max-width: 450px)").matches;
  }

  onMounted(() => {
    checkMobileMode();
    window.addEventListener("resize", checkMobileMode);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", checkMobileMode);
  });

  return { isMobile };
});
