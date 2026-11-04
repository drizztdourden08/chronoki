/* @layer shared-asset-extraction @kind logic */
import { createLeWriter } from '../buffer/le-writer';
import { SCENE_TS, T_TS12 } from './asset-types.constants';
import { chipAnimData } from './chip-anims';
import { parseChipAnims } from './parse-chip-anims';
import { decodeTiles } from './decode-tiles';
import { lzDecompress } from './lz-decompress';
import type { CtasEntry } from '../ctas/ctas.type';
import type { Corner } from './metatiles';
import { parseMetatiles } from './metatiles';
import { serMetas } from './ser-metas';
import { distinctHeaderBytes } from './distinct-header-bytes';
import type { PackTables, Packer } from './extract.type';

const readChips = (rom: Uint8Array, chipsets: Uint8Array, tsGfx: number[]): [Uint8Array, Uint8Array] => {
  const chips = new Uint8Array(768 * 64);
  const present = new Uint8Array(768);
  for (let slot = 0; slot < 6; slot += 1) {
    const cs = chipsets[slot]!;
    if (cs === 0xff || cs >= tsGfx.length) continue;
    decodeTiles(lzDecompress(rom, tsGfx[cs]!), 4)
      .slice(0, 128)
      .forEach((t, j) => {
        chips.set(t, (slot * 128 + j) * 64);
        present[slot * 128 + j] = 1;
      });
  }
  return [chips, present];
};

const readChipAnims = (rom: Uint8Array, ts: number, cs6: number, t: PackTables): [number, Uint8Array, Uint8Array] => {
  const anim = createLeWriter();
  const desc = createLeWriter();
  let nanim = 0;
  if (cs6 !== 0xff && cs6 < t.tsGfx.length) {
    const atiles = decodeTiles(lzDecompress(rom, t.tsGfx[cs6]!), 4);
    nanim = atiles.length;
    for (const a of atiles) anim.bytes(a);
    for (const [dest, srcs, durs] of parseChipAnims(chipAnimData(rom, ts))) {
      desc.u8(srcs.length & 0xff);
      desc.u16(dest & 0xffff);
      for (const d of durs) desc.u8(d & 0xff);
      for (const sc of srcs) desc.u16(sc & 0xffff);
    }
  }
  desc.u8(0);
  return [nanim, anim.toBytes(), desc.toBytes()];
};

const packTileset12: Packer = ({ rom, tables }) => {
  const out: CtasEntry[] = [];
  for (const ts of distinctHeaderBytes(rom, 1)) {
    if (ts >= 256) continue;
    const chipsets = rom.slice(SCENE_TS + ts * 8, SCENE_TS + ts * 8 + 8);
    const [chips, present] = readChips(rom, chipsets, tables.tsGfx);
    const raw = parseMetatiles(lzDecompress(rom, tables.asmPtrs[ts % tables.asmPtrs.length]!), 512, 16);
    const metas = serMetas(
      raw.map((m) => m.map(([c, b, fx, fy, pr]) => [c >= 256 ? c - 256 : 0xffff, b, fx, fy, pr] as Corner)),
      512,
    );
    const [nanim, anim, desc] = readChipAnims(rom, ts, chipsets[6]!, tables);
    const blob = createLeWriter();
    blob.bytes(chips);
    blob.bytes(present);
    blob.bytes(metas);
    blob.u16(nanim);
    blob.bytes(anim);
    blob.u16(desc.length);
    blob.bytes(desc);
    out.push({ type: T_TS12, id: ts, blob: blob.toBytes() });
  }
  return out;
};

export { packTileset12 };
