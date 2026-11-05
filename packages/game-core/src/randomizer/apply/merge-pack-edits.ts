/* @layer bridge-wasm @kind logic */
import type { PackEdit } from './apply-seed.type';

const mergePackEdits = (base: readonly PackEdit[], later: readonly PackEdit[]): PackEdit[] => {
  const byAt = new Map(base.map((e) => [e.at, e]));
  later.forEach((e) => {
    const first = byAt.get(e.at);
    byAt.set(e.at, first ? { ...e, old: first.old } : e);
  });
  return [...byAt.values()];
};

export { mergePackEdits };
