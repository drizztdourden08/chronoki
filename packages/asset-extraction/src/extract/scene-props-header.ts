/* @layer shared-asset-extraction @kind logic */
import { SCENE_HDR } from './scene-props.constants';

const sceneHeader = (rom: Uint8Array, s: number): Uint8Array => rom.slice(SCENE_HDR + s * 14, SCENE_HDR + s * 14 + 14);

export { sceneHeader };
