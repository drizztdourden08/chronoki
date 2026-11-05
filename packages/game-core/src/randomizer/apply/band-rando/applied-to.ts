/* @layer bridge-wasm @kind logic */
import type { PackEdit } from '../apply-seed.type';

const appliedTo = (pack: Uint8Array, edits: readonly PackEdit[]): Uint8Array => {
  const out = pack.slice();
  edits.forEach((e) => {
    out[e.at] = e.next;
  });
  return out;
};

export { appliedTo };
