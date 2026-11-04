/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../../pipeline/import-context.type';
import { peekOracle } from '../../oracle/peek-access';
import { bakeTiles } from '../battle-anim/anim-collect';
import { combatant, holdScript } from '../battle-anim/anim-sprites';
import { decodeOam, oamBlob } from '../shared/oam-decode';
import type { Sprite } from '../shared/oam-decode';

type Spec = [pal: number, pose: string, repF: number, ...extra: number[]];

const CRONO_IDLE_KEYS: Spec[] = [
  [5, 'CI0_rest', 400, 0],
  [5, 'CI1_down', 408, 1],
  [5, 'CI2_side', 420, 2],
];
const GATO_SWIPE_KEYS: Spec[] = [
  [1, 'GS1_windup', 520, 0, 24],
  [1, 'GS2_strike', 531, 24, 30],
  [1, 'GS3_follow', 544, 30, 49],
];

interface AddKf {
  pal: number;
  pose: string;
  rf: number;
  extra: number[];
  nObj: number;
  ax: number;
  ay: number;
  on: Sprite[];
}

interface AddGroup {
  kfs: AddKf[];
  tiles: Uint8Array[][];
}

const bakeGroup = async (ctx: ImportContext, state: Uint8Array, specs: Spec[]): Promise<AddGroup> => {
  const oracle = peekOracle(ctx);
  const kfs: AddKf[] = [];
  const tiles: Uint8Array[][] = [];
  for (const [pal, pose, rf, ...extra] of specs) {
    const dump = await oracle.peek({ state, script: holdScript(rf) });
    const on = combatant(decodeOam(oamBlob(dump.oam)), pal);
    kfs.push({
      pal,
      pose,
      rf,
      extra,
      nObj: on.length,
      ax: Math.min(...on.map((s) => s.x)),
      ay: Math.min(...on.map((s) => s.y)),
      on,
    });
    tiles.push(bakeTiles(dump.vram));
  }
  return { kfs, tiles };
};

export type { AddGroup, AddKf };
export { bakeGroup, CRONO_IDLE_KEYS, GATO_SWIPE_KEYS };
