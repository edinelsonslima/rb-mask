import { memoize } from "./memoize";

export const findMajority = memoize((array: string[], candidates: string[]) => {
  const fn = (
    acc: { qty: number; value: string; values: Record<string, number> },
    char: string,
  ) => {
    if (!candidates.includes(char)) return acc;

    if (acc.values[char]) {
      acc.values[char]++
    }

    if (!acc.values[char]) {
      acc.values[char] = 1
    }

    const currentMaxQty = Math.max(...Object.values(acc.values));

    if (currentMaxQty > acc.qty) {
      acc.qty = currentMaxQty;
      acc.value = char;
    }

    return acc;
  };

  return array.reduce(fn, { qty: 0, value: '', values: {} });
});