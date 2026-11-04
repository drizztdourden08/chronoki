/* @layer shared-asset-extraction @kind constants */
const CC: [number, number] = [0x0c0b5e, 0x0c257b];
const CFG: [number, number] = [0x3fd3fe, 0x3fd57a];
const MC: [number, number] = [0x03ff951, 0x03ff959];
const NAV: [number, number] = [0x3fb5a0, 0x3fb5a0 + 21 * 6];
const CDEF: [number, number] = [0x02fca6, 0x02fca6 + 12];
const ITEM_NAV_NOTE = [
  "// FF/B53E -- the ITEM screen's cursor graph, 15 records x 6 bytes, copied verbatim to $7E:9380 by the",
  '// screen builder exactly as FF/B5A0 (below) is on Config. Records 0..9 are the ten list rows at',
  '// (24, 87 + 12*row), 10/11 the Use/Move labels, 12..14 the target-select party cells; bytes +2..+5 are',
  "// the Up/Down/Left/Right neighbours. VERIFIED byte-identical to the oracle's live $7E:9380 on its own",
  '// Item-screen capture, whose cursor OAM $0770 = (0x18, 0x57) = record 0.',
  '#define CTITEMNAV_BASE 0x3FB53Eu',
];
const FONT_NOTE = [
  "// FF/C9FC -- sixteen 2bpp tiles the menu's graphics build C2/968D DMAs (C2/9542) over tiles 0x30-0x3F of",
  '// its font copy at $7E:5000 (FF/8E60 = FF/8C60\'s tile 0x20 on): 0x30 #, 0x31 the arrow, 0x32-0x34 frame/+,',
  "// 0x35-0x3F bold letters. Measured: the oracle's menu VRAM holds them at BG3 $E000 and BG1 4bpp tile 0x30+.",
];

export { CC, CFG, MC, NAV, CDEF, ITEM_NAV_NOTE, FONT_NOTE };
