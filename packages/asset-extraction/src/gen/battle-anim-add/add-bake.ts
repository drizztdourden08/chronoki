/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../../pipeline/import-context.type';
import { peekOracle } from '../../oracle/peek-access';
import { bakeTiles } from '../battle-anim/bake-tiles';
import { combatant } from '../battle-anim/combatant';
import { holdScript } from '../battle-anim/hold-script';
import { decodeOam } from '../shared/oam-decode';
import { oamBlob } from '../shared/oam-blob';
import type { Spec, AddKf, AddGroup } from './add-bake.type';

const bakeGroup = async (ctx: ImportContext, state: Uint8Array, specs: Spec[]): Promise<AddGroup> => {
  const oracle = peekOracle(ctx);
  const kfs: AddKf[] = [];
  const tiles: Uint8Array[][] = [];
  for (const [pal, pose, rf, ...extra] of specs) {
    const dump = await oracle.peek({ state, script: holdScript(rf), rule: false });
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

export { bakeGroup };
