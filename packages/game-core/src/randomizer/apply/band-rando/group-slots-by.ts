/* @layer bridge-wasm @kind logic */
const groupSlotsBy = <T>(slots: readonly T[], keyOf: (slot: T) => string): T[][] => {
  const groups = new Map<string, T[]>();
  slots.forEach((slot) => {
    const key = keyOf(slot);
    groups.set(key, [...(groups.get(key) ?? []), slot]);
  });
  return [...groups.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)).map(([, group]) => group);
};

export { groupSlotsBy };
