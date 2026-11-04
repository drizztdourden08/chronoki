/* @layer shared-asset-extraction @kind logic @source Python extract_assets.pack_maps */
import { createLeWriter } from '../buffer/le-writer';
import type { CtasEntry } from '../ctas/ctas.type';
import { T_MAP } from './asset-types.constants';
import { lzDecompress } from './lz-decompress';
import { parseProps } from './map-props';
import { sceneHeader } from './scene-header';
import type { Packer } from './extract.type';

const priorityPlane = (md: Uint8Array, start: number, n: number): Uint8Array => {
  const tprio = new Uint8Array(n);
  let i = start;
  let cnt = 0;
  while (cnt < n && i + 2 < md.length) {
    const b0 = md[i]!;
    const b1 = md[i + 1]!;
    const b2 = md[i + 2]!;
    i += 3;
    let rep = 1;
    if ((b0 & 0x80) !== 0) {
      rep = i < md.length ? md[i]! : 0;
      i += 1;
      rep = rep || 256;
    }
    const tp = ((b1 & 0x40) !== 0 ? 1 : 0) | ((b2 & 0x40) !== 0 ? 2 : 0);
    for (let k = 0; k < rep; k += 1) {
      if (cnt >= n) break;
      tprio[cnt] = tp;
      cnt += 1;
    }
  }
  return tprio;
};

const applyAdd = (layer: number[], w: number, h: number, add: boolean[], sw: number): void => {
  for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) if (add[y * sw + x]) layer[y * w + x]! |= 256;
};

const packMaps: Packer = ({ rom, tables }) => {
  const out: CtasEntry[] = [];
  const seen = new Set<number>();
  for (let s = 0; s < 512; s += 1) {
    const h = sceneHeader(rom, s);
    const mi = h[4]! | (h[5]! << 8);
    if (seen.has(mi) || mi >= tables.mapPtrs.length) continue;
    seen.add(mi);
    const md = lzDecompress(rom, tables.mapPtrs[mi]!);
    const size = md[0]!;
    const bits = md[1]!;
    const w1 = (size & 3) * 16 + 16;
    const h1 = ((size >> 2) & 3) * 16 + 16;
    const w2 = ((size >> 4) & 3) * 16 + 16;
    const h2 = ((size >> 6) & 3) * 16 + 16;
    const w3 = (bits & 3) * 16 + 16;
    const h3 = ((bits >> 2) & 3) * 16 + 16;
    const hasL3 = (bits & 0x80) !== 0;
    let p = 6;
    const l1 = Array.from(md.slice(p, p + w1 * h1));
    p += w1 * h1;
    const l2 = Array.from(md.slice(p, p + w2 * h2));
    p += w2 * h2;
    const l3 = hasL3 ? Array.from(md.slice(p, p + w3 * h3)) : [];
    if (hasL3) p += w3 * h3;
    const sw = Math.max(w1, w2);
    const sh = Math.max(h1, h2);
    const [l1add, l2add] = parseProps(md, p, sw * sh);
    applyAdd(l1, w1, h1, l1add, sw);
    applyAdd(l2, w2, h2, l2add, sw);
    const blob = createLeWriter();
    blob.bytes(Uint8Array.of(w1, h1, w2, h2, w3, h3, hasL3 ? 1 : 0, md[4]!, md[5]!));
    for (const v of [...l1, ...l2, ...l3]) blob.u16(v);
    blob.bytes(priorityPlane(md, p, sw * sh));
    blob.bytes(Uint8Array.of(md[1]!, md[2]!, md[3]!));
    out.push({ type: T_MAP, id: mi, blob: blob.toBytes() });
  }
  return out;
};

export { packMaps };
