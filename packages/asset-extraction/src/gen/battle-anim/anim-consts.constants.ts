/* @layer shared-asset-extraction @kind constants */
import type { Key } from './anim-consts.type';

const NTILE = 0xa0;
const BRACKET_TILE = 0x006;
const ANIM_RECIPE = 'battle_gato_press_action';

const CRONO_REF: [number, number] = [109, 108];
const GATO_REF: [number, number] = [104, 62];

const KEYS: Key[] = [
  { driver: 'mash', pal: 5, name: 'Crono', pose: 'A1_approach', repFrame: 450, startF: 447, endF: 452 },
  { driver: 'mash', pal: 5, name: 'Crono', pose: 'A2_gather', repFrame: 455, startF: 453, endF: 457 },
  { driver: 'mash', pal: 5, name: 'Crono', pose: 'A3_raise', repFrame: 465, startF: 458, endF: 472 },
  { driver: 'mash', pal: 5, name: 'Crono', pose: 'A4_strike', repFrame: 485, startF: 473, endF: 499 },
  { driver: 'mash', pal: 5, name: 'Crono', pose: 'A5_recoil', repFrame: 503, startF: 500, endF: 508 },
  { driver: 'mash', pal: 5, name: 'Crono', pose: 'A6_settle', repFrame: 515, startF: 509, endF: 525 },
  { driver: 'hold', pal: 1, name: 'GATO', pose: 'I0_armsRest', repFrame: 395, startF: 384, endF: 433 },
  { driver: 'hold', pal: 1, name: 'GATO', pose: 'I1_armsSwap', repFrame: 460, startF: 434, endF: 472 },
  { driver: 'hold', pal: 1, name: 'GATO', pose: 'G1_rearup', repFrame: 520, startF: 505, endF: 553 },
];

export { NTILE, BRACKET_TILE, ANIM_RECIPE, CRONO_REF, GATO_REF, KEYS };
