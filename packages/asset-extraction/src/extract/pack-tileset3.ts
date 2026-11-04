/* @layer shared-asset-extraction @kind logic */
import { createLeWriter } from '../buffer/le-writer';
import { T_TS3 } from './asset-types.constants';
import { decodeTiles } from './decode-tiles';
import { lzDecompress } from './lz-decompress';
import type { CtasEntry } from '../ctas/ctas.type';
import type { Corner } from './metatiles';
import { parseMetatiles, serMetas } from './metatiles';
import { distinctHeaderBytes } from './scene-header';
import type { Packer } from './extract.type';

/** extract_assets.pack_tileset3: [nchips u16][nchips*64][nchips present][has_metas u8][256 metas*16?]. */
const packTileset3: Packer = ({ rom, tables }) => {
  const { tsGfx, asm3Ptrs } = tables;
  const out: CtasEntry[] = [];
  for (const ts of distinctHeaderBytes(rom, 2)) {
    if (ts >= tsGfx.length || tsGfx[ts] === 0) continue;
    const tiles = decodeTiles(lzDecompress(rom, tsGfx[ts]!), 2);
    let metab = new Uint8Array(0);
    let hasMetas = 0;
    if (ts < asm3Ptrs.length && asm3Ptrs[ts] !== 0) {
      const raw3 = parseMetatiles(lzDecompress(rom, asm3Ptrs[ts]!), 256, 4);
      metab = serMetas(
        raw3.map((m) => m.map(([c, b, fx, fy, pr]) => [c ? c : 0xffff, b, fx, fy, pr] as Corner)),
        256,
      );
      hasMetas = 1;
    }
    const blob = createLeWriter();
    blob.u16(tiles.length);
    for (const t of tiles) blob.bytes(t);
    blob.bytes(new Uint8Array(tiles.length).fill(1));
    blob.u8(hasMetas);
    blob.bytes(metab);
    out.push({ type: T_TS3, id: ts, blob: blob.toBytes() });
  }
  return out;
};

export { packTileset3 };
