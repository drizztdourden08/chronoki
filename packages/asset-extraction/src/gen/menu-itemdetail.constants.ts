/* @layer shared-asset-extraction @kind constants */
const DRIVE = '80:2,0:6,100:2,0:12';
const OBJ = 0x8000;
const TAIL = [
  '// OBJ pal0 (16 BGR555->RGB888 triples); index 0 is the transparent color key.',
  'static const unsigned char itemCursorPal[16*3] = {',
];
const REMOVED = [
  "// (REMOVED) itemScrollArrow -- an 8x8 crop of the list scrollbar's arrow, cut out of an oracle frame",
  "// at x235/y100. It was too small: the ROM's widget is the WHOLE 16x16 OBJ tile 0x22 (the same graphic",
  "// the ribbon cursor uses, menu_arrow.h / ROM FF/9D70), and the crop sliced the tile's dark OUTLINE",
  '// away -- it even kept the outline\'s colours, with alpha 0. The Item screen now blits ctMenuArrow at',
  "// the arrow's own OAM position; see the scrollbar block in CtMenuRenderItem.",
  '#endif',
  '',
];

export { DRIVE, OBJ, TAIL, REMOVED };
