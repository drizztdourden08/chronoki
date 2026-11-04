/* @layer shared-asset-extraction @kind logic @source Python extract_assets.pack_actors */
import type { CtasEntry } from '../ctas/ctas.type';
import { T_ACTORS } from './asset-types.constants';
import { createBlobWriter } from './bytes/blob-writer';
import { extractActors } from './script/extract-actors';
import type { Actor } from './script/script-run.type';
import type { Packer } from './extract.type';

const actorsOf = (rom: Uint8Array, s: number): Actor[] => {
  try {
    return extractActors(rom, s).actors;
  } catch {
    return [];
  }
};

const packActors: Packer = ({ rom }) => {
  const entries: CtasEntry[] = [];
  for (let s = 0; s < 512; s += 1) {
    const vis = actorsOf(rom, s).filter((a) => a.visible && a.sprite !== null && a.pos !== null).slice(0, 255);
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
