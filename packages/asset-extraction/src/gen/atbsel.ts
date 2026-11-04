/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { peekOracle, recipeState } from '../oracle/peek-access';
import { emitMain } from './atbsel/emit';
import { BTN0, BTN1 } from './atbsel/emit.constants';
import { diffBbox } from './atbsel/diff-bbox';
import { toIdx } from './atbsel/to-idx';
import { buildPalette } from './atbsel/build-palette';
import { loadFb } from './atbsel/load-fb';
import { emitTypewriter } from './atbsel/typewriter';
import { penRows } from './atbsel/pen-rows';
import { TEXT_X } from './atbsel/typewriter.constants';
import type { GenFiles } from './oracle-gen-stage';

const BTNE = '0:6,20:2,0:1';
const BTNA = `${BTN1},20:2,0:1`;

/** tools/gen/atbsel.py: the new-game ATB battle-mode selector screen as src/data/atbsel.h. */
const genAtbsel = async (ctx: ImportContext): Promise<GenFiles> => {
  const state = await recipeState(ctx, 'atb_vram');
  const oracle = peekOracle(ctx);
  const frame = async (script: string) => loadFb((await oracle.peek({ state, script })).fb);
  const fr0 = await frame(BTN0);
  const fr1 = await frame(BTN1);
  const fre = await frame(BTNE);
  const { pal, idxmap } = buildPalette([fr0, fr1, fre]);
  const idx0 = toIdx(fr0, idxmap);
  const idx1 = toIdx(fr1, idxmap);
  const idxe = toIdx(fre, idxmap);
  const bbox = diffBbox(idx0, idx1);
  if (!bbox) throw new Error('atbsel: ROW0 and ROW1 captures do not differ');
  const [x0, x1, y0, y1] = bbox;
  const pw = x1 - x0 + 1;
  const ph = y1 - y0 + 1;
  const row = (r: number[][], j: number): number[] => (r[j] as number[]);
  const patch = Array.from({ length: ph }, (_, j) => Array.from({ length: pw }, (_, i) => row(idx1, y0 + j)[x0 + i] as number));
  let out = emitMain({ pal, idx0, patch, px0: x0, py0: y0, pw, ph });
  const pens = penRows(ctx.rom);
  const empty: (number | undefined)[][] = Array.from({ length: ph }, (_, j) =>
    Array.from({ length: pw }, (_, i) => row(idxe, y0 + j)[x0 + i]),
  );
  const ia = (await frame(BTNA)).map((r) => r.map((c) => idxmap.get(c)));
  const ca = TEXT_X + (((pens[0] as number[][])[0] as number[])[0] as number);
  const cw = TEXT_X + (((pens[1] as number[][])[0] as number[])[0] as number);
  const rows = new Set<number>();
  for (let y = y0; y < y0 + ph; y += 1) {
    for (let x = ca; x < cw; x += 1) {
      if ((ia[y] as (number | undefined)[])[x] !== row(idxe, y)[x]) rows.add(y);
    }
  }
  for (const y of [...rows].sort((a, b) => a - b)) {
    for (let x = ca; x < cw; x += 1) {
      (empty[y - y0] as (number | undefined)[])[x - x0] = (ia[y] as (number | undefined)[])[x];
    }
  }
  out += emitTypewriter({ pens, empty, ex: x0, ey: y0, ew: pw, eh: ph });
  return { 'atbsel.h': out };
};

export { genAtbsel };
