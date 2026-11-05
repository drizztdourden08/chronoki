/* @layer bridge-wasm @kind constants */
import type { EndingPoint } from './ending-splice.type';

const MAGUS_ID = 6;
const MAGUS_SCENE = 0x0ac;
const MAGUS_ANCHOR: readonly number[] = [0x5a, 0x8a];

const LOC_ENDING: EndingPoint = {
  scene: 0x0b5,
  anchor: [0xda],
  story: 0x99,
  place: 'before',
  why: 'loc-ending',
};

export { LOC_ENDING, MAGUS_ANCHOR, MAGUS_ID, MAGUS_SCENE };
