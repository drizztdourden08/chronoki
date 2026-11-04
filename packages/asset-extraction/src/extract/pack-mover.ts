/* @layer shared-asset-extraction @kind logic */
import { T_MOVER } from './asset-types.constants';
import type { Packer } from './extract.type';

/** extract_assets.pack_mover: C0/F300 atan 32x32 (0x400) + C0/F700 facing (0x100) + C0/F800 sine (0x140). */
const packMover: Packer = ({ rom }) => [{ type: T_MOVER, id: 0, blob: rom.slice(0xf300, 0xf940) }];

export { packMover };
