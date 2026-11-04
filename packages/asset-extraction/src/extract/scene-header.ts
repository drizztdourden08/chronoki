/* @layer shared-asset-extraction @kind logic @source Python extract_assets._hdr, extract_assets._distinct */
import { SCENE_HDR } from './asset-types.constants';

const sceneHeader = (rom: Uint8Array, s: number): Uint8Array => rom.slice(SCENE_HDR + s * 14, SCENE_HDR + s * 14 + 14);

export { sceneHeader };
