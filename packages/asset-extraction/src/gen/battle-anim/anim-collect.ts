/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../../pipeline/import-context.type';
import { peekOracle } from '../../oracle/peek-access';
import type { PeekDump } from '../../oracle/peek.type';
import type { Sprite } from '../shared/oam-decode';
import { decodeOam, oamBlob, oamCgram } from '../shared/oam-decode';
import { KEYS } from './anim-consts.constants';
import { combatant } from './combatant';
import { scriptFor } from './script-for';
import type { Keyframe, Collected } from './anim-collect.type';
import { bakeTiles } from './bake-tiles';

const collect = async (ctx: ImportContext, state: Uint8Array): Promise<Collected> => {
  const oracle = peekOracle(ctx);
  const dumps = new Map<string, PeekDump>();
  const kfs: Keyframe[] = [];
  const objFlat: Sprite[] = [];
  const tiles: Uint8Array[][] = [];
  let cgram: Uint8Array = new Uint8Array(0);
  for (const key of KEYS) {
    const id = `${key.driver}:${key.repFrame}`;
    let dump = dumps.get(id);
    if (!dump) {
      dump = await oracle.peek({ state, script: scriptFor(key.driver, key.repFrame) });
      dumps.set(id, dump);
    }
    cgram = oamCgram(dump.oam) ?? cgram;
    const on = combatant(decodeOam(oamBlob(dump.oam)), key.pal);
    kfs.push({
      key,
      objOff: objFlat.length,
      nObj: on.length,
      ax: Math.min(...on.map((s) => s.x)),
      ay: Math.min(...on.map((s) => s.y)),
    });
    objFlat.push(...on);
    tiles.push(bakeTiles(dump.vram));
  }
  return { kfs, objFlat, tiles, cgram };
};

export { collect };
