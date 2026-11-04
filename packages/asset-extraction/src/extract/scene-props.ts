/* @layer shared-asset-extraction @kind logic @source Python extract_assets._hdr, maps.scene_props */
import { byteAt } from './bytes/byte-reader';
import { itemAt } from './bytes/item-at';
import { lzDecompress } from './lz-decompress';
import { getEntries3Byte } from './rom-read';
import { MAP_PTRS } from './scene-props.constants';
import type { SceneProps } from './scene-props.type';
import { sceneHeader } from './scene-props-header';

const sceneProps = (rom: Uint8Array, scene: number): SceneProps => {
  const h = sceneHeader(rom, scene);
  const mapI = byteAt(h, 4) | (byteAt(h, 5) << 8);
  const md = lzDecompress(rom, itemAt(getEntries3Byte(rom, MAP_PTRS, 202), mapI));
  const size = byteAt(md, 0);
  const bits = byteAt(md, 1);
  const w1 = (size & 3) * 16 + 16;
  const h1 = ((size >> 2) & 3) * 16 + 16;
  const w2 = ((size >> 4) & 3) * 16 + 16;
  const h2 = ((size >> 6) & 3) * 16 + 16;
  const w3 = (bits & 3) * 16 + 16;
  const h3 = ((bits >> 2) & 3) * 16 + 16;
  const hasL3 = (bits & 0x80) !== 0;
  const p = 6 + w1 * h1 + w2 * h2 + (hasL3 ? w3 * h3 : 0);
  const sw = Math.max(w1, w2);
  const sh = Math.max(h1, h2);
  const n = sw * sh;
  const coll = new Array<number>(n).fill(0);
  const zplane = new Array<number>(n).fill(0);
  const zflags = new Array<number>(n).fill(0);
  const mover = new Array<number>(n).fill(0);
  let cnt = 0;
  let i = p;
  while (cnt < n && i + 2 < md.length) {
    const b0 = byteAt(md, i);
    const b1 = byteAt(md, i + 1);
    const b2 = byteAt(md, i + 2);
    i += 3;
    const c = (b0 >> 2) & 0x1f;
    const z = b2 & 3;
    const zf =
      (b2 & 0x04 ? 1 : 0) | (b2 & 0x08 ? 2 : 0) | (b2 & 0x20 ? 4 : 0) | (b1 & 0x10 ? 8 : 0) | (b2 & 0x40 ? 0x10 : 0) | (b1 & 0x40 ? 0x20 : 0);
    const mv = (b2 & 0x80 ? 1 : 0) | (b2 & 0x10 ? 2 : 0);
    let rep = 1;
    if (b0 & 0x80) {
      rep = i < md.length ? byteAt(md, i) : 0;
      i += 1;
      rep = rep || 256;
    }
    for (let k = 0; k < rep; k += 1) {
      if (cnt < n) {
        coll[cnt] = c;
        zplane[cnt] = z;
        zflags[cnt] = zf;
        mover[cnt] = mv;
        cnt += 1;
      }
    }
  }
  return { w: sw, h: sh, coll, zplane, zflags, mover };
};

export { sceneProps };
export type { SceneProps };
