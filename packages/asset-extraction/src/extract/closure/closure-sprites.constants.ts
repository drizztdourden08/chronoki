/* @layer shared-asset-extraction @kind constants */

const E4 = 0x240000;
const SPRITE_RECS: [number, number, number][] = [
  [E4 + 0xf000, 5, Math.floor((0xf600 - 0xf000) / 5)],
  [E4 + 0xf600, 10, Math.floor((0xffe0 - 0xf600) / 10)],
];

export { E4, SPRITE_RECS };
