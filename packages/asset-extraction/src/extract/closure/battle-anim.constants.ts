/* @layer shared-asset-extraction @kind constants */

const C1 = 0x010000;
const CD = 0x0d0000;
const CE = 0x0e0000;
const ANIM_OP_JT = C1 + 0x7a6b;
const ANIM_OPS = 0xdb;

const ANIM_TABLES: [number, number, number][] = [
  [CD + 0x5ec6, CD + 0x5ef0, CE],
  [CD + 0x5ef0, CD + 0x5ff0, CE],
  [CD + 0x5ff0, CD + 0x61f0, CD],
  [CD + 0x61f0, CD + 0x63f0, CD],
  [CD + 0x63f0, CD + 0x656e, CE],
];

export { C1, CD, CE, ANIM_OP_JT, ANIM_OPS, ANIM_TABLES };
