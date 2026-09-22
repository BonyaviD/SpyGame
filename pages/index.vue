<template>
  <ScreenLayout variant="compact">
    <template #header>
      <AppLogo with-text size="lg" />
    </template>

    <nav class="home-actions" aria-label="منوی اصلی">
      <AppButton to="/guide" variant="outline" block>راهنمای بازی؟</AppButton>
      <AppButton to="/setup" block>شروع بازی!</AppButton>
    </nav>

    <template #footer>
      <AppCredit />
    </template>
  </ScreenLayout>
</template>

<style scoped>
.home-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding-top: var(--space-6);
}
</style>
