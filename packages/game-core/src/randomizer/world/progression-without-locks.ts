/* @layer bridge-wasm @kind logic */
import type { CtItem } from './ct-world-keys.type';
import type { UnboundSpotLock } from './unbound-spot-locks';

const progressionWithoutLocks = <T extends CtItem>(progression: readonly T[], locks: readonly UnboundSpotLock[]): T[] => {
  const left = [...progression];
  for (const [, item] of locks) {
    const at = left.indexOf(item as T);
    if (at >= 0) left.splice(at, 1);
  }
  return left;
};

export { progressionWithoutLocks };
