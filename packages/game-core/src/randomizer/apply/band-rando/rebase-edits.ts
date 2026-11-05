/* @layer bridge-wasm @kind logic */
import type { PackEdit } from '../apply-seed.type';

const rebasedEdits = (original: Uint8Array, edits: readonly PackEdit[]): PackEdit[] =>
  edits.map((e) => ({ ...e, old: original[e.at] ?? 0 }));

export { rebasedEdits };
