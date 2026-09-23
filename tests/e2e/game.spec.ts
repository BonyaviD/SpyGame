import { expect, test } from "@playwright/test";
import { SPY_CARD_TEXT, confirm, revealAll, revealCard, startRound, voteFor } from "./helpers";

const PLAYERS = ["علی", "سارا", "رضا"];

test.beforeEach(async ({ page }) => {
  // Each test starts from an empty game.
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
});

test("plays a full round where citizens catch the spy", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "شروع بازی!" }).click();
  await expect(page).toHaveURL(/\/setup$/);

  await startRound(page, PLAYERS);
  const cards = await revealAll(page, PLAYERS);

  // Exactly one spy; everyone else sees the same word.
  const spy = PLAYERS.find((name) => cards[name] === SPY_CARD_TEXT)!;
  const words = new Set(PLAYERS.filter((name) => name !== spy).map((name) => cards[name]));
  expect(spy).toBeTruthy();
  expect(words.size).toBe(1);
  const [word] = words;

  await page.getByRole("button", { name: "شروع بحث" }).click();
  await expect(page).toHaveURL(/\/discussion$/);
  await expect(page.getByRole("timer")).toBeVisible();

  await voteFor(page, [spy]);
  await expect(page.getByRole("heading", { name: "جاسوس گیر افتاد!" })).toBeVisible();

  // The spy guesses wrong.
  const options = page.locator(".voting__options button");
  await expect(options).toHaveCount(6);
  await options
    .filter({ hasNotText: new RegExp(`^${word}$`) })
    .first()
    .click();
  await page.getByRole("button", { name: "ثبت حدس" }).click();
  await confirm(page, /^حدس نهایی/, "ثبت حدس");

  await expect(page).toHaveURL(/\/result$/);
  await expect(page.getByRole("heading", { name: "شهروندها بردند!" })).toBeVisible();
  await expect(page.locator(".result__facts")).toContainText(word);
  await expect(page.locator(".scoreboard__row")).toHaveCount(3);
});

test("lets the spy win when an innocent player is accused", async ({ page }) => {
  await startRound(page, PLAYERS);
  const cards = await revealAll(page, PLAYERS);
  const innocent = PLAYERS.find((name) => cards[name] !== SPY_CARD_TEXT)!;

  await page.getByRole("button", { name: "شروع بحث" }).click();
  await voteFor(page, [innocent]);

  await expect(page).toHaveURL(/\/result$/);
  await expect(page.getByRole("heading", { name: "جاسوس برد!" })).toBeVisible();
});

test("keeps the round after a reload in the middle of dealing", async ({ page }) => {
  await startRound(page, PLAYERS);
  const firstCard = await revealCard(page, PLAYERS[0]);

  await page.reload();
  await expect(page).toHaveURL(/\/reveal$/);
  await expect(page.getByText("کارت ۲ از ۳")).toBeVisible();
  const cards = await revealAll(page, PLAYERS.slice(1));

  // Same round: the word did not change and there is still exactly one spy.
  const all = [firstCard, ...Object.values(cards)];
  expect(all.filter((text) => text === SPY_CARD_TEXT)).toHaveLength(1);
  expect(new Set(all.filter((text) => text !== SPY_CARD_TEXT)).size).toBe(1);
});

test("asks before cancelling a round with the back button", async ({ page }) => {
  await startRound(page, PLAYERS);

  await page.goBack();
  const dialog = page.getByRole("dialog", { name: "بازی لغو شود؟" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "ادامه" }).click();
  await expect(page).toHaveURL(/\/reveal$/);

  await page.getByRole("link", { name: "بازگشت" }).click();
  await confirm(page, "بازی لغو شود؟", "لغو بازی");
  await expect(page).toHaveURL(/\/setup$/);
  // Players are kept for the next round.
  await expect(page.getByText(PLAYERS[0], { exact: true })).toBeVisible();
});

test("redirects round pages to setup when no round is running", async ({ page }) => {
  for (const path of ["/reveal", "/discussion", "/voting", "/result"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/setup$/);
  }
});

test("validates player names", async ({ page }) => {
  await page.goto("/setup");
  await page.getByRole("button", { name: "افزودن بازیکن" }).click();
  const dialog = page.getByRole("dialog", { name: "بازیکن جدید" });
  const input = dialog.getByRole("textbox", { name: "نام بازیکن" });

  await input.fill("علی");
  await input.press("Enter");
  await input.fill("علي"); // Arabic yeh: same name
  await input.press("Enter");
  await expect(dialog.getByRole("alert")).toHaveText("این نام قبلاً ثبت شده است.");

  await input.fill("   ");
  await input.press("Enter");
  await expect(dialog.getByRole("alert")).toHaveText("نام بازیکن را وارد کنید.");
});
