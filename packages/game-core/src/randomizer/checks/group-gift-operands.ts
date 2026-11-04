/* @layer bridge-wasm @kind logic */
import type { GiftGroup, GiftOperand } from './read-pack-entries.type';

const groupGiftOperands = (operands: GiftOperand[]): GiftGroup[] => {
  const groups = new Map<string, GiftGroup>();
  operands.forEach((g) => {
    const key = `${g.object}:${g.item}`;
    const group = groups.get(key);
    if (group) group.patchAt.push(g.patchAt);
    else groups.set(key, { object: g.object, item: g.item, patchAt: [g.patchAt], variant: null });
  });
  const perObject = new Map<number, GiftGroup[]>();
  groups.forEach((group) => perObject.set(group.object, [...(perObject.get(group.object) ?? []), group]));
  perObject.forEach((list) => {
    if (list.length > 1) list.forEach((group, k) => { group.variant = k; });
  });
  return [...groups.values()].sort((x, y) => x.object - y.object);
};

export { groupGiftOperands };
