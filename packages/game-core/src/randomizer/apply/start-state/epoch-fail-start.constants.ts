/* @layer bridge-wasm @kind constants */
import type { CtFlagBit, CtPoke } from './ct-start-state.type';

const EPOCH_FAIL_FLAGS: readonly CtFlagBit[] = [
  { at: 0x7f00ec, bits: 0x04 },
  { at: 0x7f00ee, bits: 0x80 },
  { at: 0x7f00ef, bits: 0x10 },
  { at: 0x7f01f0, bits: 0x01 },
  { at: 0x7f01a3, bits: 0x02 },
];

const EPOCH_FAIL_DROPPED_FLAG: CtFlagBit = { at: 0x7f00ba, bits: 0x80 };

const EPOCH_FAIL_POKES: readonly CtPoke[] = [
  { at: 0x7e027e, value: 0, width: 1 },
  { at: 0x7e028f, value: 0, width: 1 },
  { at: 0x7e0294, value: 0x80, width: 1 },
  { at: 0x7e029f, value: 0x1f0, width: 2 },
];

const EPOCH_FAIL_WARP = { location: 0x1b7, x: 0x18, y: 0x04 };

export { EPOCH_FAIL_DROPPED_FLAG, EPOCH_FAIL_FLAGS, EPOCH_FAIL_POKES, EPOCH_FAIL_WARP };
