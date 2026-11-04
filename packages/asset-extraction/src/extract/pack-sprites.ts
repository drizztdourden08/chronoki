/* @layer shared-asset-extraction @kind logic */
import type { CtasEntry } from '../ctas/ctas.type';
import { T_SPRITE } from './asset-types.constants';
import { decodeTiles } from './decode-tiles';
import { createBlobWriter } from './lib/blob-writer';
import { animSetIndex, assemblyFrame, buildAnim, nextAnimPointer, spriteAnimTables } from './lib/sprite-anims';
import type { AssemblyFrame } from './lib/sprite-anims';
import { parseTables, readHeader, readSpriteGraphics, readSpritePalette } from './lib/sprite-records';
import type { Packer } from './extract.type';

/** The anim count bounding a sprite's frames (2 when the tables can't be read). */
const animBound = (rom: Uint8Array, si: number): number => {
  try {
    const { fp } = spriteAnimTables(rom);
    const ai = animSetIndex(rom, si);
    const base = ai < fp.length ? (fp[ai] as number) : 0;
    const nxt = base ? nextAnimPointer(fp, base) : 0;
    const per = base ? Math.floor(Math.floor((nxt - base) / 4) / 4) : 1;
    return Math.max(1, Math.min(per, 64));
  } catch {
    return 2;
  }
};

/** extract_assets.pack_sprites body for one sprite; throws wherever Python raises (the caller skips the sprite). */
const spriteBlob = (rom: Uint8Array, si: number, staticMax: number | undefined): Uint8Array => {
  const { gfxPtrs, palPtrs, asmPtrs } = parseTables(rom);
  const h = readHeader(rom, si);
  const tiles = decodeTiles(readSpriteGraphics(rom, gfxPtrs, h.bitmap), 4);
  const pal = readSpritePalette(rom, palPtrs, h.palette);
  let mf = 1;
  const nanims = animBound(rom, si);
  for (let act = 0; act < nanims; act += 1) {
    for (const [sf] of buildAnim(rom, si, act)) mf = Math.max(mf, Math.max(...sf) + 1);
  }
  mf = Math.max(mf, (staticMax ?? 0) + 1);
  let frames: AssemblyFrame[] = [];
  let maxsrc = 0;
  for (let f = 0; f < mf; f += 1) {
    let fr: AssemblyFrame;
    try {
      fr = assemblyFrame(rom, asmPtrs, h, f);
    } catch {
      break;
    }
    frames.push(fr);
    for (const c of fr.chips) maxsrc = Math.max(maxsrc, c & 0x3ff);
  }
  if (frames.length > 255) frames = frames.slice(0, 255);
  const ntiles = Math.min(tiles.length, maxsrc + 1);
  const w = createBlobWriter();
  w.u8(h.size & 3);
  w.u8(frames.length & 0xff);
  w.u16(ntiles);
  for (const rgb of pal) w.bytes(rgb);
  for (const t of tiles.slice(0, ntiles)) w.bytes(t);
  for (const fr of frames) {
    for (const c of fr.chips) w.u16(c);
    for (const [ox, oy] of fr.offs) {
      w.u8(ox & 0xff);
      w.u8(oy & 0xff);
    }
  }
  return w.toBytes();
};

/** extract_assets.pack_sprites: per used sprite its decoded tiles, palette and assembly frames. */
const packSprites: Packer = ({ rom, tables }) => {
  const entries: CtasEntry[] = [];
  for (const si of [...tables.usedSprites].sort((a, b) => a - b)) {
    try {
      entries.push({ type: T_SPRITE, id: si, blob: spriteBlob(rom, si, tables.staticMax.get(si)) });
    } catch {
      continue;
    }
  }
  return entries;
};

export { packSprites };
