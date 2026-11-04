/* @layer shared-asset-extraction @kind logic @source Python extract_assets.pack_scene_headers */
import { T_SCENE_HDR } from './asset-types.constants';
import { sceneHeader } from './scene-header';
import type { Packer } from './extract.type';

const packSceneHeaders: Packer = ({ rom }) =>
  Array.from({ length: 512 }, (_, s) => ({ type: T_SCENE_HDR, id: s, blob: sceneHeader(rom, s) }));

export { packSceneHeaders };
