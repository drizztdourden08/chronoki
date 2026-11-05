/* @layer bridge-wasm @kind logic */
const compareKeys = (a: string, b: string): number => {
  if (a < b) return -1;
  return a > b ? 1 : 0;
};

const groupSlotsBy = <T>(slots: readonly T[], keyOf: (slot: T) => string): T[][] => {
  const groups = new Map<string, T[]>();
  slots.forEach((slot) => {
    const key = keyOf(slot);
    groups.set(key, [...(groups.get(key) ?? []), slot]);
  });
  return [...groups.entries()].sort(([a], [b]) => compareKeys(a, b)).map(([, group]) => group);
};

export { groupSlotsBy };
