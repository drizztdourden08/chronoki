/* @layer shared-asset-extraction @kind constants */
import type { Spec } from './add-bake.type';

const CRONO_IDLE_KEYS: Spec[] = [
  [5, 'CI0_rest', 400, 0],
  [5, 'CI1_down', 408, 1],
  [5, 'CI2_side', 420, 2],
];
const GATO_SWIPE_KEYS: Spec[] = [
  [1, 'GS1_windup', 520, 0, 24],
  [1, 'GS2_strike', 531, 24, 30],
  [1, 'GS3_follow', 544, 30, 49],
];

export { CRONO_IDLE_KEYS, GATO_SWIPE_KEYS };
