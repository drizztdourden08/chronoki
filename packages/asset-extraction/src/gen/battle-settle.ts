/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { peekOracle, recipeState } from '../oracle/peek-access';
import { emitSettle, NTILE } from './battle-settle-emit';
import type { SettleKf } from './battle-settle-emit';
import type { GenFiles } from './oracle-gen-stage';
import { decodeOam } from './shared/oam-decode';
import { oamBlob } from './shared/oam-blob';
import type { Sprite } from './shared/oam-decode.type';

/** The active-PC selection bracket: excluded (its own asset). */
const BRACKET = 0x006;
/** gato_kill = gato_mid with GATO's curHP $6130 = 6. */
const KILL_POKE = '6130=06';
/** (name, repN, pal): C0/M0 = idle at kill; C1-C4/M1-M4 = the settle. */
const KEYS: [name: string, n: number, pal: number][] = [
  ['C0', 178, 5],
  ['C1', 194, 5],
  ['C2', 204, 5],
  ['C3', 214, 5],
  ['C4', 226, 5],
  ['M0', 178, 6],
  ['M1', 186, 6],
  ['M2', 196, 6],
  ['M3', 210, 6],
  ['M4', 228, 6],
];

/** Mash-A script: alternating 100:c / 0:c chunks of up to 16 frames, f frames in all. */
const mash = (f: number): string => {
  let n = 0;
  let hold = true;
  const parts: string[] = [];
  while (n < f) {
    const c = Math.min(16, f - n);
    parts.push(`${hold ? '100' : '0'}:${c}`);
    n += c;
    hold = !hold;
  }
  return parts.join(',');
};

const cluster = (sprites: Sprite[], pal: number): Sprite[] =>
  sprites
    .filter((s) => s.y < 210 && s.x > -60 && s.x < 256 && s.pal === pal && s.tile !== BRACKET)
    .sort((a, b) => a.idx - b.idx);

/** tools/gen/battle_settle.py: the victory settle-in ladder as src/data/battle_settle.h. */
const genBattleSettle = async (ctx: ImportContext): Promise<GenFiles> => {
  const oracle = peekOracle(ctx);
  const state = await recipeState(ctx, 'battle_gato_press_action');
  const mid = (await oracle.peek({ state, script: '100:8,0:392', save: true })).state;
  if (!mid) throw new Error('the oracle returned no saved state for gato_mid');
  const kfs: SettleKf[] = [];
  const objFlat: Sprite[] = [];
  for (const [name, n, pal] of KEYS) {
    const script = `${mash(110)}${n > 110 ? `,0:${n - 110}` : ''}`;
    const dump = await oracle.peek({ state: mid, script, env: { PEEK_POKE: KILL_POKE } });
    const on = cluster(decodeOam(oamBlob(dump.oam)), pal);
    if (on.length === 0) continue;
    const tiles: Uint8Array[] = [];
    for (let t = 0; t < NTILE; t += 1) tiles.push(dump.vram.slice(t * 32, t * 32 + 32));
    kfs.push({
      name,
      n,
      pal,
      objOff: objFlat.length,
      nObj: on.length,
      ax: Math.min(...on.map((s) => s.x)),
      ay: Math.min(...on.map((s) => s.y)),
      tiles,
    });
    objFlat.push(...on);
  }
  return { 'battle_settle.h': emitSettle(kfs, objFlat) };
};

export { genBattleSettle };
