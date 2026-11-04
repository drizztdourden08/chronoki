/* @layer shared-asset-extraction @kind logic */
import { md5Hex } from './md5';

const bodyMd5 = (vram: Uint8Array, tiles: number[]): string => {
  const body: number[] = [];
  for (const t of tiles) {
    for (const sub of [t, t + 1, t + 0x10, t + 0x11]) {
      const o = (sub & 0x1ff) * 32;
      for (let i = 0; i < 32; i += 1) body.push(vram[o + i] as number);
    }
  }
  return md5Hex(Uint8Array.from(body)).slice(0, 8);
};

export { bodyMd5 };
