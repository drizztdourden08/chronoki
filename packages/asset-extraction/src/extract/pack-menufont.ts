/* @layer shared-asset-extraction @kind logic @source Python extract_assets.pack_menufont */
import { T_MENUFONT } from './asset-types.constants';
import type { Packer } from './extract.type';

const packMenufont: Packer = ({ rom }) => [{ type: T_MENUFONT, id: 0, blob: rom.slice(0x3f8c60, 0x3f8c60 + 256 * 16) }];

export { packMenufont };
