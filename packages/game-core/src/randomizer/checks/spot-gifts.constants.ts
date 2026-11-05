/* @layer bridge-wasm @kind constants */
import type { SpotGift } from './spot-gift.type';

const SPOT_GIFTS: readonly SpotGift[] = [
  {
    spot: 'ki-cyrus-grave', option: 'addCyrusGraveSpot', scene: 0x049, anchor: [0x65, 0x86, 0xa3], why: 'spot-cyrus-grave',
  },
  {
    spot: 'ki-ozzies-fort', option: 'addOzzieSpot', scene: 0x0b5, anchor: [0x65, 0x87, 0xa1], why: 'spot-ozzies-fort',
  },
];

export { SPOT_GIFTS };
