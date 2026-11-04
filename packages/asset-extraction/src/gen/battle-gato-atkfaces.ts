/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { peekOracle, recipeState } from '../oracle/peek-access';
import type { PeekDump } from '../oracle/peek.type';
import { hex } from './c-hex';
import { atkFacesText } from './battle-gato-atkfaces/atkfaces-emit';
import type { Face, Pose } from './battle-gato-atkfaces/atkfaces-emit.type';
import type { GenFiles } from './oracle-gen-stage.type';
import { tileSheet } from './shared/tile-sheet';
import { bodyMd5 } from './shared/body-md5';
import { gatoFoot } from './shared/gato-foot';
import { BRACKET_TILE } from './shared/gato-bake.constants';
import { decodeOam } from './shared/oam-decode';
import { oamBlob } from './shared/oam-blob';
import { peekSaved } from './shared/peek-save';
import { CRONO_AT, GATO_BODY, CAPS } from './battle-gato-atkfaces.constants';
import type { Anchor } from './battle-gato-atkfaces.type';

const hex2 = (v: number): string => hex(v, 2);
const pyAnchor = (a: Anchor): string => `(${a[0]}, ${a[1]})`;

const genBattleGatoAtkfaces = async (ctx: ImportContext): Promise<GenFiles> => {
  const state = await recipeState(ctx, 'battle_gato_press_action');
  const oracle = peekOracle(ctx);
  const mid = await peekSaved(oracle, { state, script: '100:8,0:392' });
  const capture = (prefix: string): Promise<PeekDump> => {
    const [side, n] = prefix.split('_f') as [string, string];
    const [x, y] = CRONO_AT[side] as [number, number];
    const poke = `1D0C=${hex2(x)},1D23=${hex2(y)},5EB0=00,5EB1=00,5ECA=80`;
    return oracle.peek({ state: mid, script: `0:${n}`, env: { PEEK_POKE: poke } });
  };

  const poses: Pose[] = [];
  const bakePose = async (label: string, prefix: string, exp: Anchor): Promise<number> => {
    const dump = await capture(prefix);
    const cells = decodeOam(oamBlob(dump.oam))
      .filter((s) => s.y < 210 && s.x > -60 && s.x < 256 && s.pal === 1 && GATO_BODY.includes(s.tile) && s.tile !== BRACKET_TILE)
      .sort((a, b) => a.idx - b.idx);
    const [fx, fy] = gatoFoot(dump.wram);
    const ax = Math.min(...cells.map((s) => s.x));
    const ay = Math.min(...cells.map((s) => s.y));
    if (ax !== exp[0] || ay !== exp[1]) throw new Error(`${label} anchor (${ax},${ay}) != dossier ${pyAnchor(exp)}`);
    if (cells.length !== 12) throw new Error(`${label}: ${cells.length} cells (want 12)`);
    if (cells.some((s) => s.hflip || s.vflip)) throw new Error(`${label}: hf/vf must be 0 (corpus 1.1)`);
    poses.push({
      label,
      rel: cells.map((s) => ({ rx: s.x - fx, ry: s.y - fy, tile: s.tile })),
      tiles: tileSheet(dump.vram),
      md5: bodyMd5(dump.vram, [...GATO_BODY].sort((a, b) => a - b)),
    });
    return poses.length - 1;
  };

  const faces: Face[] = [];
  for (const [name, facing, strikeAt, rp, ra, sp, sa] of CAPS) {
    const rear = await bakePose(`${name}_rear`, rp, ra);
    const strike = sp && sa ? await bakePose(`${name}_strike`, sp, sa) : rear;
    faces.push({ name, facing, strikeAt, rear, strike });
  }
  const md5s = poses.map((p) => p.md5);
  if (new Set(md5s).size !== md5s.length) {
    throw new Error(`attack pose VRAM must be DISTINCT (corpus 1.1/1.2): [${md5s.map((m) => `'${m}'`).join(', ')}]`);
  }
  return { 'battle_gato_atkfaces.h': atkFacesText(poses, faces) };
};

export { genBattleGatoAtkfaces };
