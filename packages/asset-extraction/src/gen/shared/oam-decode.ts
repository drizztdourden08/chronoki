/* @layer shared-asset-extraction @kind logic */
import type { Sprite } from './oam-decode.type';
import { OAM_SIZE } from './oam-decode.constants';

const decodeOam = (data: Uint8Array): Sprite[] => {
  if (data.length < OAM_SIZE) throw new Error(`OAM blob must be ${OAM_SIZE} bytes, got ${data.length}`);
  const sprites: Sprite[] = [];
  for (let i = 0; i < 128; i += 1) {
    const x = data[i * 4] as number;
    const y = data[i * 4 + 1] as number;
    const tile = data[i * 4 + 2] as number;
    const attr = data[i * 4 + 3] as number;
    const hb = data[512 + (i >> 2)] as number;
    const shift = (i % 4) * 2;
    let sx = x | (((hb >> shift) & 1) << 8);
    if (sx >= 256) sx -= 512;
    sprites.push({
      idx: i,
      x: sx,
      y,
      tile: tile | ((attr & 1) << 8),
      attr,
      prio: (attr >> 4) & 3,
      pal: (attr >> 1) & 7,
      size: (hb >> (shift + 1)) & 1,
      vflip: (attr >> 7) & 1,
      hflip: (attr >> 6) & 1,
      onscreen: sx >= 0 && sx < 256 && y < 224,
    });
  }
  return sprites;
};

export { decodeOam };
