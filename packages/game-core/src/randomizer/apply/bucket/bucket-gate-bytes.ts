/* @layer bridge-wasm @kind logic */
import { OBJECTIVE_GATE_AT } from '../../world/bucket/bucket.constants';
import { WRAM_BANK_7F } from '../../../game-info/wram-map.constants';
import {
  ANCHOR_JUMP_AT, ANCHOR_JUMP_BASE, BUCKET_ANCHOR, FLAG_PAGE_ONE, GATE_JUMP_BASE, IF_FLAG_BYTES, OP_IF_FLAG,
} from './bucket-gate.constants';

const GATE_BYTE = OBJECTIVE_GATE_AT - WRAM_BANK_7F - 0x100;

const bucketGateBytes = (): Uint8Array => {
  const openDistance = (BUCKET_ANCHOR[ANCHOR_JUMP_AT] ?? 0) + ANCHOR_JUMP_BASE + IF_FLAG_BYTES - GATE_JUMP_BASE;
  return Uint8Array.from([OP_IF_FLAG, GATE_BYTE, 0x00, FLAG_PAGE_ONE, openDistance, ...BUCKET_ANCHOR]);
};

export { bucketGateBytes };
