/* @layer shared-asset-extraction @kind logic */
import { hexByte } from '../c-text';
import { md5Hex } from './md5';

const NTILE = 0xa0;
const BRACKET_TILE = 0x006;

const gatoFoot = (wram: Uint8Array): [number, number] => [wram[0x1d0c + 6] as number, wram[0x1d23 + 6] as number];

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

const tileSheet = (vram: Uint8Array): Uint8Array[] =>
  Array.from({ length: NTILE }, (_, t) => vram.slice(t * 32, t * 32 + 32));

const sheetRows = (tiles: Uint8Array[]): string =>
  tiles.map((t) => `  {${Array.from(t, hexByte).join(',')}},\n`).join('');

export { BRACKET_TILE, NTILE, bodyMd5, gatoFoot, sheetRows, tileSheet };
