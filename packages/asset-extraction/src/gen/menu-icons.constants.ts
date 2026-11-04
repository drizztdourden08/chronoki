/* @layer shared-asset-extraction @kind constants */
const HEADER = [
  '// Menu ribbon icons from the oracle OBJ VRAM (chr $4000/byte $8000, OBJ pal 0). base 004..00E =',
  '// GREY unselected; highlight 024..02E = the SELECTED icon\'s REAL colors -- CT loads a DIFFERENT OBJ',
  '// pal0 per selection (each icon\'s own colours), so each highlight tile is decoded with the palette',
  '// from the state where THAT icon is selected (sel$i.state). See disasm/notes/menu_phase2.md.',
  '#ifndef CT_MENU_ICONS_H',
  '#define CT_MENU_ICONS_H',
  '#include <stdint.h>',
  '',
  'static const uint8_t ctMenuIconBase[6][16*16*4] = {',
];

export { HEADER };
