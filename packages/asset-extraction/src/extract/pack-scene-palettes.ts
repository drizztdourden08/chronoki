/* @layer shared-asset-extraction @kind logic */
import { T_SCENE_PAL } from './asset-types.constants';
import { flattenRgb } from './flatten-rgb';
import { scenePalette } from './scene-palette';
import { distinctHeaderBytes } from './scene-header';
import type { Packer } from './extract.type';

/** extract_assets.pack_scene_palettes: 128 x RGB per distinct palette index. */
const packScenePalettes: Packer = ({ rom }) =>
  distinctHeaderBytes(rom, 3).map((pi) => ({ type: T_SCENE_PAL, id: pi, blob: flattenRgb(scenePalette(rom, pi)) }));

export { packScenePalettes };
