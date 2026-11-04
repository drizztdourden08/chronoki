/* @layer shared-asset-extraction @kind constants */
const DRIVE = '100:2,0:40';
const SINGLE: [string, number][] = [
  ['weapon', 0x20],
  ['helm', 0x27],
  ['armor', 0x28],
  ['accessory', 0x29],
];
const HEADER = [
  '// gen_opt0.h  -- opt0 (Equip/Status) DETAIL graphics extracted from the oracle.',
  '// (The portraits and element plaques are decoded from the ROM itself: menu.c mDetailArt, C2/EC38 + C2/A273.)',
  '// Format: RGBA8888 rows. Color index 0 -> (0,0,0,0) transparent. Palettes resolved from oracle CGRAM.',
  '#ifndef GEN_OPT0_H',
  '#define GEN_OPT0_H',
  '#include <stdint.h>',
  '// RGBA packed little-endian as 0xAABBGGRR',
  '',
  '// Equip-type icons (BG1 char base0, PALETTE 0), drawn at col17/x136 left of each equip name.',
];
const TILES_DOC = [
  '',
  "// The 10 equip-TYPE icon tiles 0x20-0x29 (BG1 pal0), indexed by (tile-0x20): the ROM draws an item's",
  '// icon = BYTE 0 of its $CC:0B5E name record (0x20 sword/0x21 bow/0x22 gun/0x23 arm/0x24 katana/0x25 fist/',
  '// 0x26 scythe/0x27 helm/0x28 armor/0x29 accessory). Extracted from the oracle VRAM (0x20/27/28/29 verified',
  '// byte-identical to the prior single icons).',
  'static const uint8_t gen_opt0_icon_tiles[10][8*8] = {',
];

export { DRIVE, SINGLE, HEADER, TILES_DOC };
