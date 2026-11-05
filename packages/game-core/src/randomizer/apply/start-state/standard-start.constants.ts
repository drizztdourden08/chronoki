/* @layer bridge-wasm @kind constants */
import type { CtStartState } from './ct-start-state.type';

const STANDARD_START: CtStartState = {
  id: 'jot-standard',
  flags: [
    { at: 0x7f0057, bits: 0x80 },
    { at: 0x7f00a3, bits: 0x30 },
    { at: 0x7f00f7, bits: 0x02 },
    { at: 0x7f00ba, bits: 0x80 },
  ],
  clear: [{ at: 0x7f0056, bits: 0x01 }],
  pokes: [
    { at: 0x7f0000, value: 0x0c, width: 1 },
    { at: 0x7f01ed, value: 1, width: 1 },
    { at: 0x7f0146, value: 3, width: 1 },
    { at: 0x7e027e, value: 2, width: 1 },
    { at: 0x7e028f, value: 2, width: 1 },
    { at: 0x7e0290, value: 0x270, width: 2 },
    { at: 0x7e0292, value: 0x258, width: 2 },
    { at: 0x7e0294, value: 0xf2, width: 1 },
    { at: 0x7e029f, value: 0x1f1, width: 2 },
    { at: 0x7e2881, value: 0x1f0, width: 2 },
    { at: 0x7e2883, value: 0x1f1, width: 2 },
  ],
  party: { join: [1] },
  warp: { location: 0x1f1, x: 0x4e, y: 0x4b, facing: 1 },
};

export { STANDARD_START };
