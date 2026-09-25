import { spawn, type ChildProcess } from "node:child_process";
import { expect, test } from "@playwright/test";

/**
 * Runs its own copy of the static server so it can be shut down mid-test: that is the only
 * reliable way to go offline here, because Playwright's setOffline and route() also block the
 * responses a service worker serves from its cache.
 */
const PORT = 3101;
const ORIGIN = `http://localhost:${PORT}`;

// The service worker is blocked in the other tests; this one needs it.
test.use({ serviceWorkers: "allow" });

let server: ChildProcess | undefined;

const startServer = async () => {
  server = spawn(process.execPath, ["scripts/serve-static.mjs"], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: "ignore",
  });
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      if ((await fetch(ORIGIN)).ok) return;
    } catch {
      // not listening yet
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Offline test server did not start");
};

const stopServer = async () => {
  const running = server;
  server = undefined;
  // exitCode stays null for a killed process on Windows, so track "stopped" ourselves.
  if (!running || running.exitCode !== null || running.signalCode !== null) return;
  const exited = new Promise((resolve) => running.once("exit", resolve));
  running.kill();
  await exited;
};

test.afterEach(stopServer);

test("works offline after the first visit", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile",
    "The service worker is the same for every project.",
  );

  await startServer();
  await page.goto(ORIGIN);
  // Wait until the service worker has cached the app and controls the page.
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 30_000 });

  await stopServer();

  await page.goto(ORIGIN);
  await expect(page.getByRole("link", { name: "شروع بازی!" })).toBeVisible();
  await page.getByRole("link", { name: "شروع بازی!" }).click();
  await expect(page.getByRole("heading", { name: "بازیکنان" })).toBeVisible();

  await page.goto(`${ORIGIN}/guide`);
  await expect(page.getByRole("heading", { name: "راهنمای بازی" })).toBeVisible();
});
