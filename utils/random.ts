/** Uniform random integer in [0, max). */
export const randomInt = (max: number) => Math.floor(Math.random() * max);

export const randomItem = <T>(items: readonly T[]): T => {
  if (!items.length) throw new Error("randomItem: empty list");
  return items[randomInt(items.length)];
};

/**
 * Short unique id. `crypto.randomUUID` only exists in secure contexts,
 * and the game is often opened over plain http on a local network.
 */
export const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/** Returns a shuffled copy (Fisher–Yates). */
export const shuffle = <T>(items: readonly T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
