/* @layer shared-asset-extraction @kind logic */
/** 8x8 tiles 0x00..0x9F cover Crono(0x08..)/Marle(0x20..)/GATO(0x68..0x9F). */
const NTILE = 0xa0;
/** The pulsing white active-PC selection bracket: its own asset (battle_bracket.h), never a combatant. */
const BRACKET_TILE = 0x006;
/** The recipe both battle_anim and battle_anim_add start from. */
const ANIM_RECIPE = 'battle_gato_press_action';

const CRONO_REF: [number, number] = [109, 108];
const GATO_REF: [number, number] = [104, 62];

interface Key {
  driver: 'mash' | 'hold';
  pal: number;
  name: string;
  pose: string;
  repFrame: number;
  startF: number;
  endF: number;
}

const k = (driver: 'mash' | 'hold', pal: number, name: string, pose: string, r: number, s: number, e: number): Key => ({
  driver,
  pal,
  name,
  pose,
  repFrame: r,
  startF: s,
  endF: e,
});

/** (driver, pal, name, pose, repFrame, startF, endF); repFrame = mid-dwell. */
const KEYS: Key[] = [
  k('mash', 5, 'Crono', 'A1_approach', 450, 447, 452),
  k('mash', 5, 'Crono', 'A2_gather', 455, 453, 457),
  k('mash', 5, 'Crono', 'A3_raise', 465, 458, 472),
  k('mash', 5, 'Crono', 'A4_strike', 485, 473, 499),
  k('mash', 5, 'Crono', 'A5_recoil', 503, 500, 508),
  k('mash', 5, 'Crono', 'A6_settle', 515, 509, 525),
  k('hold', 1, 'GATO', 'I0_armsRest', 395, 384, 433),
  k('hold', 1, 'GATO', 'I1_armsSwap', 460, 434, 472),
  k('hold', 1, 'GATO', 'G1_rearup', 520, 505, 553),
];

export type { Key };
export { ANIM_RECIPE, BRACKET_TILE, CRONO_REF, GATO_REF, KEYS, NTILE };
