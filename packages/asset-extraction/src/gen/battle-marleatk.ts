/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { peekOracle, recipeState } from '../oracle/peek-access';
import type { PeekOracle } from '../oracle/peek.type';
import { emitMarleAtk } from './battle-marleatk-emit';
import { NTILE } from './battle-marleatk-emit.constants';
import type { MarleKf, SparkKf, TrajRow } from './battle-marleatk-emit.type';
import type { GenFiles } from './oracle-gen-stage.type';
import { decodeOam, oamBlob } from './shared/oam-decode';
import type { Sprite } from './shared/oam-decode';
import { BRK, MARLE_HOME, MARLE_KF, SPARK_KF, MASH, MONITOR_LINE } from './battle-marleatk.constants';

const bs = (t: number): string => {
  const ci = Math.floor(t / 32);
  const rem = t % 32;
  const s = '100:16,0:16,'.repeat(ci);
  if (rem === 0) return s.slice(0, -1);
  return s + (rem <= 16 ? `100:${rem}` : `100:16,0:${rem - 16}`);
};

const onpal = (spr: Sprite[], pal: number, tlo: number, thi: number): Sprite[] =>
  spr
    .filter((s) => s.y < 210 && s.x > -60 && s.x < 256 && s.pal === pal && s.tile !== BRK && s.tile >= tlo && s.tile < thi)
    .sort((a, b) => a.idx - b.idx);

const slices = (vram: Uint8Array, n: number): Uint8Array[] => {
  const out: Uint8Array[] = [];
  for (let t = 0; t < n; t += 1) out.push(vram.slice(t * 32, t * 32 + 32));
  return out;
};

const bakeMarle = async (oracle: PeekOracle, state: Uint8Array): Promise<MarleKf[]> => {
  const kfs: MarleKf[] = [];
  for (const [pose, rf] of MARLE_KF) {
    const dump = await oracle.peek({ state, script: bs(rf) });
    const on = onpal(decodeOam(oamBlob(dump.oam)), 6, 0x20, 0x38);
    kfs.push({
      pose,
      rf,
      ax: Math.min(...on.map((s) => s.x)),
      ay: Math.min(...on.map((s) => s.y)),
      on,
      tiles: slices(dump.vram, NTILE),
    });
  }
  return kfs;
};

const bakeSpark = async (oracle: PeekOracle, state: Uint8Array): Promise<(SparkKf | null)[]> => {
  const kfs: (SparkKf | null)[] = [];
  for (const [pose, rf] of SPARK_KF) {
    const dump = await oracle.peek({ state, script: bs(rf) });
    const eff = decodeOam(oamBlob(dump.oam)).filter(
      (s) => s.pal === 0 && s.tile >= 0x100 && s.tile < 0x190 && s.y < 200 && s.x > -30 && s.x < 250,
    );
    kfs.push(eff.length === 0 ? null : { pose, rf, spr: eff[0] as Sprite, vram: dump.vram });
  }
  return kfs;
};

const fromHex = (h: string): number[] => (h.match(/../g) ?? []).map((p) => parseInt(p, 16));

const marleTraj = async (oracle: PeekOracle, state: Uint8Array): Promise<TrajRow[]> => {
  const lines = await oracle.monitor({ state, regions: '0700:512,0900:32', script: MASH });
  const fr = new Map<number, Sprite[]>();
  for (const raw of lines) {
    const m = MONITOR_LINE.exec(raw.replaceAll('*', ' '));
    if (m) fr.set(Number(m[1]), decodeOam(Uint8Array.from([...fromHex(m[2] as string), ...fromHex(m[3] as string)])));
  }
  const poses = new Map<string, number>();
  const rows: TrajRow[] = [];
  for (let f = 872; f < 951; f += 1) {
    const sprites = fr.get(f);
    if (!sprites) continue;
    const on = onpal(sprites, 6, 0x20, 0x38);
    if (on.length === 0) continue;
    const ax = Math.min(...on.map((s) => s.x));
    const ay = Math.min(...on.map((s) => s.y));
    const asm = on
      .map((s): [number, number, number] => [s.tile, s.x - ax, s.y - ay])
      .sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2])
      .join(';');
    if (!poses.has(asm)) poses.set(asm, poses.size);
    rows.push([f, ax - (MARLE_HOME[0] as number), ay - (MARLE_HOME[1] as number), poses.get(asm) as number]);
  }
  return rows;
};

const genBattleMarleAtk = async (ctx: ImportContext): Promise<GenFiles> => {
  const oracle = peekOracle(ctx);
  const state = await recipeState(ctx, 'battle_gato_press_action');
  const mkfs = await bakeMarle(oracle, state);
  const skfs = await bakeSpark(oracle, state);
  const traj = await marleTraj(oracle, state);
  if (traj.length === 0) throw new Error('no Marle attack trajectory frames in the monitor output');
  return { 'battle_marleatk.h': emitMarleAtk(mkfs, skfs, traj) };
};

export { genBattleMarleAtk };
