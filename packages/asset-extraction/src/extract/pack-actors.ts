/* @layer shared-asset-extraction @kind logic */
import type { CtasEntry } from '../ctas/ctas.type';
import { T_ACTORS } from './asset-types.constants';
import { createBlobWriter } from './lib/blob-writer';
import { extractActors } from './script/extract-actors';
import type { Actor } from './script/script-run.type';
import type { Packer } from './extract.type';

/** extract_assets.pack_actors: per scene [count u8] + per visible actor {obj u8, sprite u16, x u16, y u16, facing u8}. */
const packActors: Packer = ({ rom }) => {
  const entries: CtasEntry[] = [];
  for (let s = 0; s < 512; s += 1) {
    let actors: Actor[] = [];
    try {
      actors = extractActors(rom, s).actors;
    } catch {
      actors = [];
    }
    const vis = actors.filter((a) => a.visible && a.sprite !== null && a.pos !== null).slice(0, 255);
    const w = createBlobWriter();
    w.u8(vis.length);
    for (const a of vis) {
      const pos = a.pos as [number, number];
      w.u8(a.obj & 0xff);
      w.u16((a.sprite as number) & 0xffff);
      w.u16(Math.trunc(pos[0]) & 0xffff);
      w.u16(Math.trunc(pos[1]) & 0xffff);
      w.u8(a.facing & 0xff);
    }
    entries.push({ type: T_ACTORS, id: s, blob: w.toBytes() });
  }
  return entries;
};

export { packActors };
