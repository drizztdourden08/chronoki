/* @layer bridge-wasm @kind logic */
import type { CtItem } from './ct-world-keys.type';

const poolFillerOf = (rest: readonly CtItem[], spotCount: number, keyItemCount: number): CtItem[] => {
  const filler = rest[0];
  const missing = Math.max(0, spotCount - keyItemCount);
  return filler === undefined ? [] : Array.from({ length: missing }, () => filler);
};

export { poolFillerOf };
