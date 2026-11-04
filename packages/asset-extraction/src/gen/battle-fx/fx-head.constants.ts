/* @layer shared-asset-extraction @kind constants */
const DIGIT_BASE = 0x190;
const NDIGIT = 10;
const DIGIT_W = 8;
const DIGIT_PAL = 0;
const FLASH_PAL = 4;
const MISS_BASE = 0x19a;
const MISS_NTILE = 2;
const FLASH_FRAME = 480;

const RISE_DY = [7, -1, -7, -10, -12, -13, -14, -15, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0];
const HOLD_FRAMES = 32;
const LIFETIME = RISE_DY.length + HOLD_FRAMES;

export { DIGIT_BASE, NDIGIT, DIGIT_W, DIGIT_PAL, FLASH_PAL, MISS_BASE, MISS_NTILE, FLASH_FRAME, RISE_DY, HOLD_FRAMES, LIFETIME };
