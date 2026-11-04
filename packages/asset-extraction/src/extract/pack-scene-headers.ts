/* @layer shared-asset-extraction @kind logic */
import { T_SCENE_HDR } from './asset-types.constants';
import { sceneHeader } from './scene-header';
import type { Packer } from './extract.type';

/** extract_assets.pack_scene_headers: the 14 raw header bytes of each of the 512 scenes. */
const packSceneHeaders: Packer = ({ rom }) =>
  Array.from({ length: 512 }, (_, s) => ({ type: T_SCENE_HDR, id: s, blob: sceneHeader(rom, s) }));

export { packSceneHeaders };
