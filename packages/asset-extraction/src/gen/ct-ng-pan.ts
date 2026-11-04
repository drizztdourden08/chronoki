/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { peekOracle, recipeState } from '../oracle/peek-access';
import { hexN } from './shared/hex-n';
import type { GenFiles } from './oracle-gen-stage.type';
import { REGS, HEADER, LINE } from './ct-ng-pan.constants';

const word = (s: string): number => parseInt(s.slice(2, 4) + s.slice(0, 2), 16);

const genCtNgPan = async (ctx: ImportContext): Promise<GenFiles> => {
  const state = await recipeState(ctx, 'ow_intro_pan');
  const lines = await peekOracle(ctx).monitor({ state, regions: REGS, frames: 2000, rule: true });
  const rows = new Map<number, number[]>();
  for (const line of lines) {
    const m = LINE.exec(line);
    if (m) {
      rows.set(Number(m[1]), [word(m[2] as string), word(m[3] as string), word(m[4] as string), parseInt(m[5] as string, 16), parseInt(m[6] as string, 16)]);
    }
  }
  const first = rows.get(0);
  if (!first) throw new Error(`ct_ng_pan: ct.exe --monitor printed no rows: ${lines.join('\n').slice(-600)}`);
  const [loc0, x, y, e3, e7] = first as [number, number, number, number, number];
  if (loc0 !== 0x1f0) throw new Error(`ct_ng_pan: the state is not on the 1000 A.D. overworld (loc ${hexN(loc0, 3)})`);
  const req = [...rows.keys()].sort((a, b) => a - b).filter((f) => (rows.get(f) as number[])[0] === 0x10f);
  if (req.length === 0) throw new Error('ct_ng_pan: the pan never requested loc $10F within 2000 frames');
  return { 'ct_ng_pan.h': HEADER({ x, y, e3, e7, n: req[0] as number }) };
};

export { genCtNgPan };
