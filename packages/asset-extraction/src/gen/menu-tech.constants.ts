/* @layer shared-asset-extraction @kind constants */
const DRIVE = '80:2,0:4,80:2,0:4,100:2,0:40';
const HEADER = [
  '// gen_tech.h - AUTO-EXTRACTED from oracle VRAM (tech_enter state: menu_open_gato2 + Right x2 + A).',
  "// The three 'Single/Dual/Triple' category TABS at the tech screen's top-right.",
  '// Each tab = 2x2 = 16x16 px, four 8x8 4bpp tiles in order {TL,TR,BL,BR} (VRAM tiles 0x164..0x16F).',
  '// Palette: SELECTED tab -> techTabPal[0] (CGRAM row4), UNSELECTED -> techTabPal[1] (CGRAM row5).',
  '// Pixel index 0 = transparent (shows panel bg). Indices 1..15 -> techTabPal[sel][idx].',
  '#ifndef GEN_TECH_H',
  '#define GEN_TECH_H',
  '#include <stdint.h>',
  '// 12 tiles x 64 nibble-indices (row-major 8x8). Groups of 4 = tab 1,2,3.',
  'static const uint8_t techTabTiles[12][64] = {',
];

export { DRIVE, HEADER };
