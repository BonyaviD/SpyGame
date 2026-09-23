import { expect, type Page } from "@playwright/test";

export const SPY_CARD_TEXT = "جاسوس";

/** Adds players from the setup page through the add-player dialog. */
export const addPlayers = async (page: Page, names: string[]) => {
  await page.getByRole("button", { name: "افزودن بازیکن" }).click();
  const dialog = page.getByRole("dialog", { name: "بازیکن جدید" });
  const input = dialog.getByRole("textbox", { name: "نام بازیکن" });
  for (const name of names) {
    await input.fill(name);
    await input.press("Enter");
    await expect(input).toHaveValue("");
  }
  await dialog.getByRole("button", { name: "تمام" }).click();
  await expect(dialog).toBeHidden();
};

/** Opens the setup page with the given players and deals the cards. */
export const startRound = async (page: Page, names: string[]) => {
  await page.goto("/setup");
  await addPlayers(page, names);
  await page.getByRole("button", { name: "پخش کارت‌ها" }).click();
  await expect(page).toHaveURL(/\/reveal$/);
};

/**
 * Passes the phone to one player, opens and closes their card.
 * Returns the text on the card (the word, or SPY_CARD_TEXT).
 */
export const revealCard = async (page: Page, name: string) => {
  await page.getByRole("button", { name: `من ${name} هستم` }).click();
  await page.getByRole("button", { name: "دیدن کارت" }).click();
  const text = (await page.locator(".reveal__word").innerText()).trim();
  await page.getByRole("button", { name: "بستن کارت" }).click();
  return text;
};

/** Deals every card and returns each player's card text. */
export const revealAll = async (page: Page, names: string[]) => {
  const cards: Record<string, string> = {};
  for (const name of names) cards[name] = await revealCard(page, name);
  return cards;
};

/** Accepts a confirmation dialog by its title and confirm button. */
export const confirm = async (page: Page, title: string | RegExp, button: string) => {
  const dialog = page.getByRole("dialog", { name: title });
  await dialog.getByRole("button", { name: button, exact: true }).click();
  await expect(dialog).toBeHidden();
};

/** From the discussion page, starts voting early and accuses the given players. */
export const voteFor = async (page: Page, suspects: string[]) => {
  await page.getByRole("button", { name: "رأی‌گیری", exact: true }).click();
  await confirm(page, "رأی‌گیری زودتر شروع شود؟", "رأی‌گیری");
  await expect(page).toHaveURL(/\/voting$/);
  for (const suspect of suspects) {
    await page.getByRole("button", { name: suspect, exact: true }).click();
  }
  await page.getByRole("button", { name: "ثبت رأی" }).click();
  await confirm(page, /^رأی به /, "ثبت رأی");
};
