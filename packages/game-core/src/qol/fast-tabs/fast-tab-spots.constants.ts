/* @layer bridge-wasm @kind constants */
import type { FastTabSpot } from './fast-tab-spot.type';

const POWER_TAB = 0xcd;
const MAGIC_TAB = 0xce;
const SPEED_TAB = 0xcf;
const TAB_FUNCTION = 1;
const OP_EXPLORE_MODE = 0xe3;
const OP_SET_BIT = 0x65;
const OP_ADD_ITEM = 0xca;
const OP_RUN_EVENT = 0xe7;
const TEXT_BOX_OPS: readonly number[] = [0xbb, 0xc1, 0xc2];

const FAST_TAB_SPOTS: readonly FastTabSpot[] = [
  { scene: 0x013, object: 41, item: POWER_TAB },
  { scene: 0x06e, object: 21, item: POWER_TAB },
  { scene: 0x077, object: 63, item: POWER_TAB },
  { scene: 0x095, object: 9, item: SPEED_TAB },
  { scene: 0x09d, object: 12, item: POWER_TAB },
  { scene: 0x0ad, object: 13, item: MAGIC_TAB },
  { scene: 0x0c4, object: 13, item: POWER_TAB },
  { scene: 0x0c7, object: 10, item: POWER_TAB },
  { scene: 0x0d3, object: 8, item: MAGIC_TAB },
  { scene: 0x0dc, object: 8, item: POWER_TAB },
  { scene: 0x0f2, object: 18, item: MAGIC_TAB },
  { scene: 0x0f4, object: 10, item: POWER_TAB },
  { scene: 0x128, object: 11, item: POWER_TAB },
  { scene: 0x178, object: 7, item: MAGIC_TAB },
  { scene: 0x1d7, object: 8, item: MAGIC_TAB },
];

const TOMAS_GRAVE_SPOT: FastTabSpot = { scene: 0x03f, object: 8, item: SPEED_TAB };

const NOTHING = new Uint8Array(0);
const LOCKED = [OP_EXPLORE_MODE, 0];
const RUN = [OP_RUN_EVENT, 0, 0];

export {
  FAST_TAB_SPOTS, LOCKED, NOTHING, OP_ADD_ITEM, OP_EXPLORE_MODE, OP_RUN_EVENT, OP_SET_BIT, RUN, TAB_FUNCTION, TEXT_BOX_OPS,
  TOMAS_GRAVE_SPOT,
};
