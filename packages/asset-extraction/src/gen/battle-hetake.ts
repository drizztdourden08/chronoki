/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { peekOracle, recipeState } from '../oracle/peek-access';
import { hetakeText } from './battle-hetake/hetake-emit';
import type { Cell, Cluster } from './battle-hetake/hetake-emit.type';
import type { GenFiles } from './oracle-gen-stage.type';
import { cgramOf } from './shared/fb-decode';
import { decodeOam } from './shared/oam-decode';
import { oamBlob } from './shared/oam-blob';
import type { Sprite } from './shared/oam-decode.type';
import { SLOT_TILES, ATK_TILES, CURSOR_SCRIPTS } from './battle-hetake.constants';

const enemyCluster = (sp: Sprite[], lo: number, hi: number): { ax: number; ay: number; g: Sprite[] } | null => {
  const g = sp.filter((s) => s.pal === 1 && s.tile >= lo && s.tile < hi && s.y < 224 && s.x >= 0 && s.x < 256);
  if (g.length === 0) return null;
  g.sort((a, b) => a.idx - b.idx);
  return { ax: Math.min(...g.map((s) => s.x)), ay: Math.min(...g.map((s) => s.y)), g };
};

const cellsRel = (g: Sprite[], ax: number, ay: number): Cell[] =>
  g.map((s) => ({ dx: s.x - ax, dy: s.y - ay, tile: s.tile, hf: s.hflip, vf: s.vflip }));

const genBattleHetake = async (ctx: ImportContext): Promise<GenFiles> => {
  const state = await recipeState(ctx, 'battle_forest_3hetake');
  const oracle = peekOracle(ctx);
  const idle = await oracle.peek({ state, script: '0:8' });
  const atk = await oracle.peek({ state, script: '0:90' });
  const isp = decodeOam(oamBlob(idle.oam));
  const asp = decodeOam(oamBlob(atk.oam));

  const clusters: Cluster[] = SLOT_TILES.map(([lo, hi]) => {
    const c = enemyCluster(isp, lo, hi);
    if (!c) throw new Error(`battle_hetake: no Hetake cluster for tiles 0x${lo.toString(16)}..0x${hi.toString(16)}`);
    return { ax: c.ax, ay: c.ay, cells: cellsRel(c.g, c.ax, c.ay) };
  });
  const ac = enemyCluster(asp, ATK_TILES[0], ATK_TILES[1]);
  if (!ac) throw new Error('battle_hetake: no attack-keyframe Hetake cluster');
  const atkAsm = cellsRel(ac.g, ac.ax, ac.ay);

  const cursors: [number, number][] = [];
  for (const script of CURSOR_SCRIPTS) {
    const dump = await oracle.peek({ state, script });
    const cur = decodeOam(oamBlob(dump.oam)).filter(
      (s) => s.prio === 3 && s.pal === 1 && s.tile === 0 && s.x >= 0 && s.x < 256 && s.y < 224,
    );
    const first = cur[0];
    cursors.push(first ? [first.x, first.y] : [0, 0]);
  }
  return { 'battle_hetake.h': hetakeText({ idleV: idle.vram, idleCg: cgramOf(idle.oam), clusters, atkAsm, atkV: atk.vram, cursors }) };
};

export { genBattleHetake };
