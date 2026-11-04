/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { cgWord, x5 } from './ctgen/menugfx';
import { cgramOf, peek, recipeState } from './ctgen/require-tools';
import { crlf, hx } from './ctgen/text-file';
import { RIGHT5, HEAD, TAIL } from './menu-saveform.constants';

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
