/* @layer shared-asset-extraction @kind logic @source Python extract_assets.pack_sprite_palettes */
import { T_SPRITE_PAL } from './asset-types.constants';
import { flattenRgb } from './flatten-rgb';
import { readSpritePalette } from './read-table-sprite-palette';
import { spritePalettePtrs } from './sprite-tables';
import type { Packer } from './extract.type';

const packSpritePalettes: Packer = ({ rom }) => {
  const palPtrs = spritePalettePtrs(rom);
  return Array.from({ length: 253 }, (_, i) => ({
    type: T_SPRITE_PAL,
    id: i,
    blob: flattenRgb(readSpritePalette(rom, palPtrs, i)),
  }));
};

export { packSpritePalettes };
