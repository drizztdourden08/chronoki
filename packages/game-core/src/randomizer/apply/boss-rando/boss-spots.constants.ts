/* @layer bridge-wasm @kind constants */
import type { BossSpot } from './boss-rando.type';

const BOSS_RANDO_SPOTS: readonly BossSpot[] = [
  { id: 'yakra', name: 'Yakra', scenes: [0x0c6], enemy: 144 },
  { id: 'heckran', name: 'Heckran', scenes: [0x02f], enemy: 169, checkSpot: 'ki-taban' },
  { id: 'nizbel', name: 'Nizbel', scenes: [0x121], enemy: 155, checkSpot: 'ki-reptite-lair' },
  { id: 'nizbel-ii', name: 'Nizbel II', scenes: [0x130], enemy: 156 },
  { id: 'rust-tyrano', name: 'Rust Tyrano', scenes: [0x0c5], enemy: 189, checkSpot: 'ki-giants-claw' },
  { id: 'yakra-xiii', name: 'Yakra XIII', scenes: [0x1b6], enemy: 199, checkSpot: 'ki-kings-trial' },
  { id: 'golem-boss', name: 'Golem Boss', scenes: [0x16b], enemy: 243 },
  { id: 'dalton-plus', name: 'Dalton Plus', scenes: [0x179], enemy: 162 },
  { id: 'flea-plus', name: 'Flea Plus', scenes: [0x0b6, 0x0b7], enemy: 187, checkSpot: 'ki-ozzies-fort' },
  { id: 'super-slash', name: 'Super Slash', scenes: [0x0b8], enemy: 186, checkSpot: 'ki-ozzies-fort' },
  { id: 'masa-mune', name: 'Masa and Mune', scenes: [0x097], enemy: 153, checkSpot: 'ki-denadoro-mts' },
];

export { BOSS_RANDO_SPOTS };
