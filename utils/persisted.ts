import type { Ref } from "vue";

/** Bump when the shape of stored data changes; old data is then ignored. */
const STORAGE_VERSION = 1;
const PREFIX = `spy-game:v${STORAGE_VERSION}:`;

const read = <T>(key: string): T | undefined => {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? undefined : (JSON.parse(raw) as T);
  } catch {
    // Private mode, disabled storage or corrupt JSON: start fresh.
    return undefined;
  }
};

const write = (key: string, value: unknown) => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable: the game still works, it just won't survive a reload.
  }
};

/**
 * A ref whose value is restored from and saved to localStorage.
 * `isValid` guards against stored data that no longer matches the expected shape.
 */
export const persistedRef = <T>(
  key: string,
  initial: T,
  isValid: (value: unknown) => value is T = (value): value is T => value !== undefined,
): Ref<T> => {
  const stored = read<unknown>(key);
  const state = ref(isValid(stored) ? stored : initial) as Ref<T>;

  watch(state, (value) => write(key, value), { deep: true, flush: "sync" });

  return state;
};
