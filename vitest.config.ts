import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    environment: "nuxt",
    // Playwright specs in tests/e2e are run separately (`npm run test:e2e`).
    include: ["tests/**/*.test.ts"],
  },
});
