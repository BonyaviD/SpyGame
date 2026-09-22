const MOBILE_QUERY = "(max-width: 450px)";

/** Tracks whether the viewport is phone-sized. Must be called from a component's setup. */
export const useDevice = () => {
  const mediaQuery = window.matchMedia(MOBILE_QUERY);
  const isMobile = ref(mediaQuery.matches);

  const update = (event: MediaQueryListEvent) => {
    isMobile.value = event.matches;
  };

  onMounted(() => mediaQuery.addEventListener("change", update));
  onUnmounted(() => mediaQuery.removeEventListener("change", update));

  return { isMobile: readonly(isMobile) };
};
