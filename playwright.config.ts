import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

/**
 * End-to-end tests against the production build. Run with `npm run test:e2e`
 * (builds first), or `npx playwright test` when `.output` is already built.
 */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: "fa-IR",
    // Motion tokens drop to 0ms, so page and dialog transitions don't slow the tests down.
    reducedMotion: "reduce",
    // The service worker would cache between tests; it is covered by the build itself.
    serviceWorkers: "block",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    // Real page and dialog animations: catches bugs that only show up while transitions run.
    { name: "mobile-animated", use: { ...devices["Pixel 7"], reducedMotion: "no-preference" } },
  ],
  webServer: {
    command: "node .output/server/index.mjs",
    port: PORT,
    env: { PORT: String(PORT) },
    reuseExistingServer: !process.env.CI,
  },
});
