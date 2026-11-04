/* @layer shared-asset-extraction @kind logic */
import { T_MENUFONT } from './asset-types.constants';
import type { Packer } from './extract.type';

/** extract_assets.pack_menufont: the raw 2bpp 8x8 menu font, 256 tiles x 16 bytes (tile = char code) from ROM $FF:8C60. */
const packMenufont: Packer = ({ rom }) => [{ type: T_MENUFONT, id: 0, blob: rom.slice(0x3f8c60, 0x3f8c60 + 256 * 16) }];

export { packMenufont };
