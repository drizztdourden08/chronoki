/* @layer shared-asset-extraction @kind logic @source Python extract_assets.pack_scene_palettes */
import { T_SCENE_PAL } from './asset-types.constants';
import { flattenRgb } from './flatten-rgb';
import { scenePalette } from './scene-palette';
import { distinctHeaderBytes } from './scene-header';
import type { Packer } from './extract.type';

const packScenePalettes: Packer = ({ rom }) =>
  distinctHeaderBytes(rom, 3).map((pi) => ({ type: T_SCENE_PAL, id: pi, blob: flattenRgb(scenePalette(rom, pi)) }));

export { packScenePalettes };
