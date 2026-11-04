/* @layer shared-asset-extraction @kind verbatim @source the header text emitted by the menu_arrow generator (menu_arrow.h) */
const HEAD = [
  '// menu_arrow.h - the ribbon SELECTION cursor arrow (the ▼/▲ straddling the highlighted icon).',
  '// The oracle OBJ sprite tile 0x22 (16x16, OBJ pal7), extracted from VRAM. It is a filled up-pointing',
  '// triangle (▲) occupying rows 1-12 of the 16x16 cell (rows 0,13-15 transparent) -- so blitting the',
  '// whole cell at the OAM Y auto-positions the tip next to the icon. Bottom arrow = as-is at OAM Y=128;',
  '// top arrow = vertically flipped (▼) at OAM Y=96; both at X=81+opt*16. RGBA8888, A=0 transparent.',
  "// The mid grey is BGR555 (13,12,12) through the framebuffer's (v<<3)|(v>>2) = 107,99,99 (it was baked as",
  '// 106,98,98 = v*255/31); measured 2026-09-24 on the oracle\'s ribbon and shop frames.',
  '#ifndef CT_MENU_ARROW_H',
  '#define CT_MENU_ARROW_H',
  '#include <stdint.h>',
  'static const uint8_t ctMenuArrow[16*16*4] = {',
];

export { HEAD };
