/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { readText } from '../pipeline/work-files';
import type { PeekDump } from '../oracle/peek.type';
import { peekOracle } from '../oracle/peek-access';
import { recipeState } from '../oracle/recipe-state';
import { OVERSCAN, STRIP_H, STRIP_Y0 } from './battle-hud-strip.constants';
import { rgbOfFb } from './shared/rgb-of-fb';
import type { GenFiles } from './oracle-gen-stage.type';
import { CAPTURES, HEAD } from './battle-hud-sub.constants';

const palette = async (ctx: ImportContext): Promise<string[]> => {
  const s = await readText(ctx.work, 'src/data/battle_hud.h');
  if (s === null) throw new Error('src/data/battle_hud.h is missing: the stage that makes it did not run');
  const i = s.indexOf('ctBattleHudBg1Pal[62][3]');
  if (i < 0) throw new Error('substring not found');
  const j = s.indexOf('};', i);
  return [...s.slice(i, j).matchAll(/\{(\d+),(\d+),(\d+)\}/g)].map((m) => `${Number(m[1])},${Number(m[2])},${Number(m[3])}`);
};

const bake = (dump: PeekDump, pal: string[]): number[][] => {
  const d = rgbOfFb(dump.fb);
  const rows: number[][] = [];
  for (let ry = 0; ry < STRIP_H; ry += 1) {
    const y = STRIP_Y0 + ry + OVERSCAN;
    const row: number[] = [];
    for (let x = 0; x < 256; x += 1) {
      const k = (y * 256 + x) * 3;
      const c = `${d[k]},${d[k + 1]},${d[k + 2]}`;
      const at = pal.indexOf(c);
      if (at < 0) throw new Error(`colour (${c}) at (${x},${ry}) is not in ctBattleHudBg1Pal`);
      row.push(at);
    }
    rows.push(row);
  }
  return rows;
};

const genBattleHudSub = async (ctx: ImportContext): Promise<GenFiles> => {
  const oracle = peekOracle(ctx);
  const state = await recipeState(ctx, 'gato_inbattle');
  const pal = await palette(ctx);
  const lines = [...HEAD];
  for (const [name, script] of CAPTURES) {
    const rows = bake(await oracle.peek({ state, script, rule: false, env: { PEEK_ISOBG: '0' } }), pal);
    lines.push(`static const uint8_t ${name}[${STRIP_H}][256] = {`);
    for (const r of rows) lines.push(`  {${r.join(',')}},`);
    lines.push('};');
  }
  lines.push('#endif');
  return { 'battle_hud_sub.h': `${lines.join('\n')}\n` };
};

export { genBattleHudSub };
