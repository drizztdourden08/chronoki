/* @layer shared-asset-extraction @kind logic */
import type { Packer } from './extract.type';
import { packActors } from './pack-actors';
import { packCollision } from './pack-collision';
import { packDialogue } from './pack-dialogue';
import { packExits } from './pack-exits';
import { packFont } from './pack-font';
import { packLz } from './pack-lz';
import { packMaps } from './pack-maps';
import { packMenufont } from './pack-menufont';
import { packMover } from './pack-mover';
import { packNamesprites } from './pack-namesprites';
import { packPalAnims } from './pack-pal-anims';
import { packPortraits } from './pack-portraits';
import { packSceneHeaders } from './pack-scene-headers';
import { packScenePalettes } from './pack-scene-palettes';
import { packScripts } from './pack-scripts';
import { packSound } from './pack-sound';
import { packSpriteAnims } from './pack-sprite-anims';
import { packSpritePalettes } from './pack-sprite-palettes';
import { packSprites } from './pack-sprites';
import { packStrings } from './pack-strings';
import { packTables } from './pack-tables';
import { packTileset12 } from './pack-tileset12';
import { packTileset3 } from './pack-tileset3';
import { packWorld } from './pack-world';

/** extract_assets.PACKERS: the 24 compile-* packers in the order build() calls them (the container's entry order). */
const PACKERS: Packer[] = [
  packScenePalettes,
  packSpritePalettes,
  packSceneHeaders,
  packPalAnims,
  packTileset12,
  packTileset3,
  packMaps,
  packStrings,
  packDialogue,
  packPortraits,
  packNamesprites,
  packMenufont,
  packActors,
  packCollision,
  packExits,
  packSpriteAnims,
  packFont,
  packMover,
  packSprites,
  packScripts,
  packWorld,
  packSound,
  packLz,
  packTables,
];

export { PACKERS };
