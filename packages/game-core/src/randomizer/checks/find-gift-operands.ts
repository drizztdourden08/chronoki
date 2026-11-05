/* @layer bridge-wasm @kind logic */
import { walkScriptOps } from '../../script-walk/walk-script-ops';
import { OP_ADD_ITEM } from './gift-ops.constants';
import type { GiftOperand } from './read-pack-entries.type';

const findGiftOperands = (raw: Uint8Array): GiftOperand[] => {
  const found = new Map<number, GiftOperand>();
  walkScriptOps(raw)
    .filter((o) => o.op === OP_ADD_ITEM)
    .forEach((o) => found.set(o.at + 1, { patchAt: o.at + 1, item: raw[o.at + 1] ?? 0, object: o.object }));
  return [...found.values()].sort((x, y) => x.patchAt - y.patchAt);
};

export { findGiftOperands };
