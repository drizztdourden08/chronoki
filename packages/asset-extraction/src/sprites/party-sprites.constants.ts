/* @layer shared-asset-extraction @kind constants */
const CT_PARTY_IDS = [0, 1, 2, 3, 4, 5, 6] as const;

const SPR_W = 272;
const SPR_H = 272;
const SPR_OX = 128;
const SPR_OY = 128;

const SPRITE_UNITS = [4, 8, 12, 24] as const;
const PALETTE_BYTES = 48;
const FRAME_HEADER_BYTES = 4;
const CHIP_TILE_MASK = 0x3ff;
const CHIP_FLIP_X = 0x4000;
const CHIP_FLIP_Y = 0x8000;
const STANDING_FRAME_BYTE = 3;

export {
  CHIP_FLIP_X,
  CHIP_FLIP_Y,
  CHIP_TILE_MASK,
  CT_PARTY_IDS,
  FRAME_HEADER_BYTES,
  PALETTE_BYTES,
  SPRITE_UNITS,
  SPR_H,
  SPR_OX,
  SPR_OY,
  SPR_W,
  STANDING_FRAME_BYTE,
};
