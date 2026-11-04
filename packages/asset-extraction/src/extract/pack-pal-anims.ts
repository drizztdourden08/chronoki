/* @layer shared-asset-extraction @kind logic @source Python extract_assets.pack_pal_anims */
import { createLeWriter } from '../buffer/le-writer';
import { T_PAL_ANIM } from './asset-types.constants';
import { readPaletteAnims } from './scene-palette';
import { distinctHeaderBytes } from './scene-header';
import type { Packer } from './extract.type';

const packPalAnims: Packer = ({ rom }) =>
  distinctHeaderBytes(rom, 3).map((pi) => {
    const d = createLeWriter();
    for (const [typ, ci, cc, delay, frames, colors] of readPaletteAnims(rom, pi)) {
      d.bytes(Uint8Array.of(typ & 0xff, ci & 0xff, cc & 0xff, delay & 0xff, frames.length & 0xff));
      for (const f of frames) d.u8(f & 0xff);
      d.u16(colors.length);
      for (const [r, g, b] of colors) d.bytes(Uint8Array.of(r & 0xff, g & 0xff, b & 0xff));
    }
    d.u8(0);
    return { type: T_PAL_ANIM, id: pi, blob: d.toBytes() };
  });

export { packPalAnims };
