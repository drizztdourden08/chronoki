/* @layer shared-asset-extraction @kind constants */
const RIGHT5 = `0:20${',80:2,0:8'.repeat(5)},0:40`;
const HEAD = [
  '// gen_saveform.h - BYTE-EXACT Save-screen (opt5) BG palette, captured from the LakeSnes',
  '// oracle. State: saves/menu_open_gato2.state + btnscript Right x5 (opt5 ribbon); the entered',
  '// Save screen (Right x5 + A) has IDENTICAL CGRAM (re-verified on the OPENED screen: the',
  '// overworld capture build/savechrome.raw, _gen_menuchrome_save.py). CGRAM read from',
  '// <peek>.raw.oam[1056:1568] (256 BGR555 entries); BG palettes = rows 0-7. Values are',
  '// (v<<3)|(v>>2) per channel -- the conversion LakeSnes itself renders with (measured: the',
  '// composed Save text body is 231 = (28<<3)|(28>>2), not 230 = round(28*255/31)).',
  '// WHY: the Save screen reloads CGRAM so the three save-slot button palettes (pal1/2/3, used by',
  '// tiles 0x300-0x313 in ctMenuChromeRibbonTM[5]/ctMenuChromeEnteredTM[5]) all become the SAME',
  '// grey marble in indices 8-15; the stored ctMenuChromePal is the opt0 status CGRAM where those',
  '// same palettes are black/cyan/orange -> our slot 3 rendered orange, slots 1-2 black. NOTHING',
  '// invented: replayed from the oracle\'s own CGRAM at the Save screen.',
  '#ifndef CT_GEN_SAVEFORM_H',
  '#define CT_GEN_SAVEFORM_H',
  '#include <stdint.h>',
  'static const uint8_t ctMenuChromeSavePal[8][16][3] = {',
  '',
].join('\n');
const TAIL = [
  '};',
  "// The Save screen's per-scanline WINDOW GRADIENT USED TO LIVE HERE, as a 224-entry table derived",
  '// pixel-exactly from three oracle cursor captures. It is gone because it was one INSTANCE of a',
  "// generator: the ROM builds every screen's ramp with C2/86DD out of a [kind, height] window list at",
  '// $FF:BBF2 (src/data/menu_wingrad.h), and mWinGrad(5) reproduces the table that stood here at all',
  '// 224 rows with ZERO mismatches -- which is what licensed deleting it. Its two derived facts survive',
  '// in the generator: the ramp is +8..-7 in 5-BIT space (conv5(clamp(pal5 + d5[y], 0, 31)), exact where',
  '// an 8-bit add is +-1 off at some tones), and it RESETS AND HEIGHT-NORMALISES per window -- 2 rows a',
  '// step on the three 32px slot buttons, 5 on the 80px bottom windows.',
  '#endif',
  '',
].join('\n');

export { RIGHT5, HEAD, TAIL };
