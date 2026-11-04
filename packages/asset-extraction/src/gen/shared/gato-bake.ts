/* @layer shared-asset-extraction @kind logic */
import { hexByte } from '../c-hex-byte';
import { md5Hex } from './md5';

/** OBJ tiles 0x00..0x9F of a capture's VRAM are baked per pose. */
const NTILE = 0xa0;
const BRACKET_TILE = 0x006;

/** GATO = cmb 6 (enemy slot 3): the live foot, $1D0C+6 / $1D23+6 of the capture's WRAM. */
const gatoFoot = (wram: Uint8Array): [number, number] => [wram[0x1d0c + 6] as number, wram[0x1d23 + 6] as number];

/** The first 8 hex digits of the md5 of the 2x2 blocks of each tile of `tiles` (in the given order). */
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

/** The 0xA0 tiles of 32 bytes each, from the capture's VRAM. */
const tileSheet = (vram: Uint8Array): Uint8Array[] =>
  Array.from({ length: NTILE }, (_, t) => vram.slice(t * 32, t * 32 + 32));

/** The text of one pose's tile sheet: `static const uint8_t <name><k>[<count>][32] = { ... };`. */
const sheetRows = (tiles: Uint8Array[]): string =>
  tiles.map((t) => `  {${Array.from(t, hexByte).join(',')}},\n`).join('');

export { BRACKET_TILE, NTILE, bodyMd5, gatoFoot, sheetRows, tileSheet };
