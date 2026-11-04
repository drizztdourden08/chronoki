/* @layer shared-asset-extraction @kind logic @source Python extract_assets.pack_sprite_anims */
import type { CtasEntry } from '../ctas/ctas.type';
import { T_SPRITEANIM } from './asset-types.constants';
import { createBlobWriter } from './bytes/blob-writer';
import { animSetIndex } from './anim-set-index';
import { buildAnim } from './sprite-anims';
import { nextAnimPointer } from './next-anim-pointer';
import { spriteAnimTables } from './sprite-anim-tables';
import type { Packer } from './extract.type';

const animCount = (rom: Uint8Array, si: number): number => {
  try {
    const { fp } = spriteAnimTables(rom);
    const ai = animSetIndex(rom, si);
    const base = ai < fp.length ? (fp[ai] as number) : 0;
    const nxt = base ? nextAnimPointer(fp, base) : 0;
    const dpf = base ? Math.floor((nxt - base) / 4) : 0;
    return Math.max(1, Math.min(Math.floor(dpf / 4), 64));
  } catch {
    return 1;
  }
};

const packSpriteAnims: Packer = ({ rom, tables }) => {
  const entries: CtasEntry[] = [];
  const extra = [...tables.usedSprites].filter((s) => s >= 256).sort((a, b) => a - b);
  const ids = [...Array.from({ length: 256 }, (_, i) => i), ...extra];
  for (const si of ids) {
    const nanims = animCount(rom, si);
    const w = createBlobWriter();
    w.u8(nanims);
    for (let action = 0; action < nanims; action += 1) {
      let frames: [number[], number][] = [];
      try {
        frames = buildAnim(rom, si, action);
      } catch {
        frames = [];
      }
      const list = frames.slice(0, 255);
      w.u8(list.length);
      for (const [sf, delay] of list) {
        for (const f of sf) w.u8(f & 0xff);
        w.u8(delay & 0xff);
      }
    }
    entries.push({ type: T_SPRITEANIM, id: si, blob: w.toBytes() });
  }
  return entries;
};

export { packSpriteAnims };
