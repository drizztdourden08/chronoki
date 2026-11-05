/* @layer bridge-wasm @kind logic */
import {
  ANCHOR_JUMP_AT, ANCHOR_JUMP_BASE, BUCKET_ANCHOR, FLAG_PAGE_ONE, GATE_JUMP_BASE, IF_FLAG_BYTES, OP_IF_FLAG,
} from './bucket-gate.constants';
import { GATE_BYTE } from './bucket-gate-bytes.constants';

const bucketGateBytes = (): Uint8Array => {
  const openDistance = (BUCKET_ANCHOR[ANCHOR_JUMP_AT] ?? 0) + ANCHOR_JUMP_BASE + IF_FLAG_BYTES - GATE_JUMP_BASE;
  return Uint8Array.from([OP_IF_FLAG, GATE_BYTE, 0x00, FLAG_PAGE_ONE, openDistance, ...BUCKET_ANCHOR]);
};

export { bucketGateBytes };
