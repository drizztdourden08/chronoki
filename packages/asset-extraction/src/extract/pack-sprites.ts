/* @layer shared-asset-extraction @kind logic @source Python extract_assets.pack_sprites */
import type { CtasEntry } from '../ctas/ctas.type';
import { T_SPRITE } from './asset-types.constants';
import { decodeTiles } from './decode-tiles';
import { createBlobWriter } from './bytes/blob-writer';
import { animSetIndex } from './anim-set-index';
import { assemblyFrame } from './assembly-frame';
import { buildAnim } from './sprite-anims';
import { nextAnimPointer } from './next-anim-pointer';
import { spriteAnimTables } from './sprite-anim-tables';
import type { AssemblyFrame } from './sprite-anims.type';
import type { SpriteHeader } from './sprite-records.type';
import { parseTables } from './sprite-records';
import { readHeader } from './read-sprite-header';
import { readSpriteGraphics } from './read-sprite-graphics';
import { readSpritePalette } from './read-sprite-palette';
import type { Packer } from './extract.type';

const animBound = (rom: Uint8Array, si: number): number => {
  try {
    const { fp } = spriteAnimTables(rom);
    const animSet = animSetIndex(rom, si);
    const base = animSet < fp.length ? (fp[animSet] as number) : 0;
    const nxt = base ? nextAnimPointer(fp, base) : 0;
    const per = base ? Math.floor(Math.floor((nxt - base) / 4) / 4) : 1;
    return Math.max(1, Math.min(per, 64));
  } catch {
    return 2;
  }
};

const frameLimit = (rom: Uint8Array, si: number, staticMax: number | undefined): number => {
  let mf = 1;
  const nanims = animBound(rom, si);
  for (let act = 0; act < nanims; act += 1) {
    for (const [sf] of buildAnim(rom, si, act)) mf = Math.max(mf, Math.max(...sf) + 1);
  }
  return Math.max(mf, (staticMax ?? 0) + 1);
};

const assembleFrames = (rom: Uint8Array, asmPtrs: number[], h: SpriteHeader, mf: number): { frames: AssemblyFrame[]; maxsrc: number } => {
  const frames: AssemblyFrame[] = [];
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
  return { frames: frames.length > 255 ? frames.slice(0, 255) : frames, maxsrc };
};

const writeSprite = (h: SpriteHeader, pal: [number, number, number][], tiles: Uint8Array[], frames: AssemblyFrame[], maxsrc: number): Uint8Array => {
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

const spriteBlob = (rom: Uint8Array, si: number, staticMax: number | undefined): Uint8Array => {
  const { gfxPtrs, palPtrs, asmPtrs } = parseTables(rom);
  const h = readHeader(rom, si);
  const tiles = decodeTiles(readSpriteGraphics(rom, gfxPtrs, h.bitmap), 4);
  const pal = readSpritePalette(rom, palPtrs, h.palette);
  const { frames, maxsrc } = assembleFrames(rom, asmPtrs, h, frameLimit(rom, si, staticMax));
  return writeSprite(h, pal, tiles, frames, maxsrc);
};

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
