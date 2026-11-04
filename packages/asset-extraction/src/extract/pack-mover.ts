/* @layer shared-asset-extraction @kind logic @source Python extract_assets.pack_mover */
import { T_MOVER } from './asset-types.constants';
import type { Packer } from './extract.type';

const packMover: Packer = ({ rom }) => [{ type: T_MOVER, id: 0, blob: rom.slice(0xf300, 0xf940) }];

export { packMover };
