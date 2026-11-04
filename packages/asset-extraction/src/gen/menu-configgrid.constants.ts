/* @layer shared-asset-extraction @kind constants */
const DRIVE = '80:2,0:4,80:2,0:4,80:2,0:4,0:6,100:2,0:12';
const ICONS: [string, number, number, number][] = [
  ['CFG_ICON_STEREO', 0x13c, 5, 1],
  ['CFG_ICON_BATTLEMODE', 0x144, 5, 1],
  ['CFG_ICON_SAVEMENU', 0x158, 5, 1],
  ['CFG_ICON_SAVEBATTLE', 0x15c, 5, 1],
  ['CFG_ICON_SAVESKILL', 0x160, 6, 1],
  ['CFG_ICON_BATTLESPEED', 0x138, 5, 1],
  ['CFG_ICON_WINDOWCOLOR', 0x148, 5, 1],
  ['CFG_ICON_BATTLEGAUGE', 0x154, 5, 1],
  ['CFG_ICON_CONTROLPAD', 0x14c, 5, 1],
  ['CFG_ICON_SKILLINFO', 0x140, 5, 1],
  ['CFG_CHECKBOX_EMPTY', 0x130, 5, 1],
  ['CFG_CHECKBOX_CHECKED', 0x134, 5, 1],
  ['CFG_FACE_LEFT', 0x152, 5, 0],
  ['CFG_FACE_RIGHT', 0x150, 5, 0],
];
const HEADER = [
  '// gen_configgrid.h -- Config-screen ICON GRAPHICS extracted from the oracle VRAM.',
  '// SOURCE: saves/menu_open_gato2.state --btnscript "80:2,0:4,80:2,0:4,80:2,0:4,0:6,100:2,0:12" (enter Config).',
  '//   VRAM BG char base 0, 4bpp; tile N at VRAM byte N*32. CGRAM palettes (BGR555, re-expanded 2026-09-24 as the' +
    ' PPU does, (v<<3)|(v>>2); the capture had v*255/31): pal5 rows 80..95,',
  '//   pal6 rows 96..111. Each icon = a 2x2 tile block (TL=base, TR=base+1, BL=base+2, BR=base+3) -> 16x16.',
  '//   Format: palette-RESOLVED RGBA8888, row-major, 16 rows x 16 px x 4 bytes. Color index 0 = transparent',
  '//   (A=0); the red check in CFG_CHECKBOX_CHECKED is pal5 color index 14 = (222,24,16).',
  '// Faces (CFG_FACE_*) are 8 rows x 16 px (a 2x1 horizontal tile pair) flanking the Battle-Gauge-Speed',
  '//   number row. All derived byte-for-byte from VRAM; nothing invented.',
  '#ifndef GEN_CONFIGGRID_H',
  '#define GEN_CONFIGGRID_H',
  '#include <stdint.h>',
  '',
];

export { DRIVE, ICONS, HEADER };
