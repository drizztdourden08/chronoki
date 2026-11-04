/* @layer shared-asset-extraction @kind logic @source Python extract_assets.pack_exits */
import type { CtasEntry } from '../ctas/ctas.type';
import { T_EXITS } from './asset-types.constants';
import { createBlobWriter } from './bytes/blob-writer';
import { sceneExits } from './scene-exits';
import type { SceneExit } from './scene-exits';
import type { Packer } from './extract.type';

const packExits: Packer = ({ rom }) => {
  const entries: CtasEntry[] = [];
  for (let s = 0; s < 512; s += 1) {
    let exits: SceneExit[] = [];
    try {
      exits = sceneExits(rom, s);
    } catch {
      exits = [];
    }
    const w = createBlobWriter();
    const list = exits.slice(0, 255);
    w.u8(list.length);
    for (const e of list) {
      w.u16(e.pos[0]);
      w.u16(e.pos[1]);
      w.u16(e.size[0]);
      w.u16(e.size[1]);
      w.u8(e.kind === 'scene' ? 1 : 0);
      w.u16(e.dest & 0xffff);
      w.i16(e.dpos[0]);
      w.i16(e.dpos[1]);
      w.u8(e.facing & 0xff);
    }
    entries.push({ type: T_EXITS, id: s, blob: w.toBytes() });
  }
  return entries;
};

export { packExits };
