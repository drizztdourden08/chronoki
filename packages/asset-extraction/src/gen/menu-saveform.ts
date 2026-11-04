/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { cgWord, x5 } from './ctgen/menugfx';
import { cgramOf, peek, recipeState } from './ctgen/require-tools';
import { crlf, hx } from './ctgen/text-file';

/** The ribbon moves to opt5 (Save). */
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

/** tools/gen/menu_saveform.py: the Save screen's (opt5) BG palettes, ctMenuChromeSavePal (recipe menu_open_gato2, Right x5). */
const genMenuSaveform = async (ctx: ImportContext): Promise<string> => {
  const out = await peek(ctx, await recipeState(ctx, 'menu_open_gato2'), RIGHT5);
  const cg = cgramOf(out);
  const ents: string[][] = [];
  for (let p = 0; p < 8; p += 1) {
    ents.push(
      Array.from({ length: 16 }, (_, k) => {
        const q = cgWord(cg, p * 16 + k);
        return `{${x5(q & 31)},${x5((q >> 5) & 31)},${x5((q >> 10) & 31)}}`;
      }),
    );
  }
  const marble = (p: number): string => (ents[p] as string[]).slice(8).join('|');
  if (!(marble(1) === marble(2) && marble(2) === marble(3) && marble(3) === marble(0))) {
    throw new Error(
      `menu_saveform: CGRAM row 1 does not carry the marble -- the ribbon is not on Save ($0067 ${hx(out.wram[0x67] as number, 2)})`,
    );
  }
  const rows = ents.map((ent, p) => `  {${ent.join(',')}}, /* pal${p} */\n`).join('');
  return crlf(HEAD + rows + TAIL);
};

export { genMenuSaveform };
