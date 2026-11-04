/* @layer shared-asset-extraction @kind logic */
import { T_FONT } from './asset-types.constants';
import { createBlobWriter } from './lib/blob-writer';
import type { Packer } from './extract.type';

/**
 * extract_assets.pack_font: dialogue VWF font chars 0xA0-0xF3 (84 glyphs, 12x12, 2bpp). The left 8 px are 24-byte cells
 * (0x3F2060 + ch*24), the right 4 px nibble-packed per char pair (0x3F3860 + (ch>>1)*24). Widths at 0x0260E6.
 * Blob: 84 widths + per glyph 12 rows x {plane0 u16, plane1 u16}.
 */
const packFont: Packer = ({ rom }) => {
  const w = createBlobWriter();
  w.bytes(rom.subarray(0x0260e6, 0x0260e6 + 84));
  for (let gi = 0; gi < 84; gi += 1) {
    const ch = 0xa0 + gi;
    for (let row = 0; row < 12; row += 1) {
      for (let plane = 0; plane < 2; plane += 1) {
        const k = row * 2 + plane;
        const main = rom[0x3f2060 + ch * 24 + k] as number;
        const ext = rom[0x3f3860 + (ch >> 1) * 24 + k] as number;
        const nib = (ch & 1) === 0 ? ext >> 4 : ext & 0x0f;
        const row12 = (main << 4) | nib;
        w.u8(row12 & 0xff);
        w.u8(row12 >> 8);
      }
    }
  }
  return [{ type: T_FONT, id: 0, blob: w.toBytes() }];
};

export { packFont };
