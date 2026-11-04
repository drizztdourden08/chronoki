/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { wramOf } from '../recipes/wram-of';
import { peekOracleless } from './shared/state-recipe';
import type { GenFiles } from './oracle-gen-stage.type';
import { hexByte } from './c-hex-byte';
import { HEAD } from './ct-charbase.constants';

const genCtCharbase = async (ctx: ImportContext): Promise<GenFiles> => {
  const gato = wramOf(await peekOracleless(ctx, 'gato_wait'));
  const rec = ctx.rom.slice(0xc0000, 0xc0280);
  for (let cid = 0; cid < 8; cid += 1) {
    const b = cid * 0x50;
    rec.set(gato.subarray(0x2600 + b + 0x36, 0x2600 + b + 0x41), b + 0x36);
  }
  const rows: string[] = [];
  for (let i = 0; i < 0x280; i += 16) rows.push(`  ${Array.from(rec.subarray(i, i + 16), hexByte).join(',')},`);
  return { 'ct_charbase.h': `${HEAD.join('\n')}\n${rows.join('\n')}\n};\n#endif\n` };
};

export { genCtCharbase };
