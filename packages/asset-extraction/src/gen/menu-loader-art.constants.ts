/* @layer shared-asset-extraction @kind constants */
const ICON_BASE = 0x3fe55c;
const ICON_PAL = 0x3fcc84;
const NUMT = [
  [0x001, 0x002, 0x011, 0x012],
  [0x003, 0x004, 0x013, 0x014],
  [0x005, 0x006, 0x015, 0x016],
];
const ICON_DOC =
  '// The seven party FACE ICONS the summary window draws (BG1 tiles 0x1E0.. at cols 15-16).\n' +
  '// Four 4bpp tiles each, stored RAW in the ROM at $FF:E55C + charId * 0x80 in reading order\n' +
  '// (tl, tr, bl, br), with a SIXTEEN-COLOUR PALETTE OF ITS OWN at $FF:CC84 + charId * 0x20 --\n' +
  '// the three party rows\' tilemap cells carry CGRAM rows 4/5/6, one per character. Both were\n' +
  '// located by searching the ROM for this screen\'s own VRAM tiles and CGRAM rows; index 7 of\n' +
  '// the tile table is garbage, so it holds exactly the seven playable characters.\n' +
  '// Index 0 is transparent and is emitted as the sentinel below.\n' +
  '#define CT_LOADER_ICON_TRANSPARENT 0x01000000u\n' +
  'static const uint32_t ctLoaderIcon[7][16][16] = {\n';
const TONE_DOC =
  '// The tone the BG3 VWF strings are drawn in: this screen\'s CGRAM row 4, 2bpp.\n' +
  'static const uint8_t ctLoaderVwfTone[4][3] = {\n';
const NUMERAL_DOC =
  '// The three BIG SLOT NUMERALS (BG3 tiles 001/002+011/012, 003/004+013/014,\n' +
  '// 005/006+015/016 at cols 3-4 of each slot row).  The ROM BUILDS these -- they are not in\n' +
  '// the ROM raw -- so they are baked from this screen\'s own BG3 CHR (word 0x7000, 2bpp),\n' +
  '// resolved through CGRAM row 4, the palette their tilemap cells carry.\n' +
  'static const uint32_t ctLoaderNumeral[3][16][16] = {\n';

export { ICON_BASE, ICON_PAL, NUMT, ICON_DOC, TONE_DOC, NUMERAL_DOC };
