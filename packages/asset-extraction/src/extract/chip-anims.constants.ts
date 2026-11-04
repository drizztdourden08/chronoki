/* @layer shared-asset-extraction @kind constants */

const ANIM_PTRS = 0x3df290;
const ANIM_REL = 0x3df310;
const ANIM_END = 0x3df9cc;
const CHIP_DUR: Record<number, number> = { 0x10: 16, 0x20: 12, 0x40: 8, 0x80: 4 };

export { ANIM_PTRS, ANIM_REL, ANIM_END, CHIP_DUR };
