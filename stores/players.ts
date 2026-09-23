import { defineStore } from "pinia";
import { MAX_NAME_LENGTH, MAX_PLAYERS, MIN_PLAYERS } from "~/data/config";
import type { Player } from "~/types/game";
import { persistedRef } from "~/utils/persisted";
import { createId } from "~/utils/random";

const isPlayerList = (value: unknown): value is Player[] =>
  Array.isArray(value) &&
  value.every(
    (item) => typeof item?.id === "string" && typeof item?.name === "string" && item.name.trim(),
  );

/** Trims, collapses whitespace and unifies Arabic/Persian letter variants. */
export const normalizeName = (name: string) =>
  name.trim().replace(/\s+/g, " ").replace(/ي/g, "ی").replace(/ك/g, "ک");

export const usePlayers = defineStore("players", () => {
  const players = persistedRef<Player[]>("players", [], isPlayerList);

  const isFull = computed(() => players.value.length >= MAX_PLAYERS);
  const hasEnough = computed(() => players.value.length >= MIN_PLAYERS);

  /** Returns a user-facing error message, or null when the name can be added. */
  const validateName = (rawName: string): string | null => {
    const name = normalizeName(rawName);
    if (!name) return "نام بازیکن را وارد کنید.";
    if (name.length > MAX_NAME_LENGTH) return `نام حداکثر ${MAX_NAME_LENGTH} حرف باشد.`;
    if (isFull.value) return `حداکثر ${MAX_PLAYERS} بازیکن می‌توانند بازی کنند.`;
    if (players.value.some((player) => player.name === name)) return "این نام قبلاً ثبت شده است.";
    return null;
  };

  /** Adds a player and returns null, or returns the validation error without adding. */
  const addPlayer = (rawName: string): string | null => {
    const error = validateName(rawName);
    if (error) return error;
    players.value.push({ id: createId(), name: normalizeName(rawName) });
    return null;
  };

  const removePlayer = (id: string) => {
    players.value = players.value.filter((player) => player.id !== id);
  };

  const reset = () => {
    players.value = [];
  };

  return { players, isFull, hasEnough, validateName, addPlayer, removePlayer, reset };
});
