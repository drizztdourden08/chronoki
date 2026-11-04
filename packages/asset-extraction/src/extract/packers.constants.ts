/* @layer shared-asset-extraction @kind constants */
import type { Packer } from './extract.type';
import { packScenePalettes } from './pack-scene-palettes';
import { packSpritePalettes } from './pack-sprite-palettes';
import { packSceneHeaders } from './pack-scene-headers';
import { packPalAnims } from './pack-pal-anims';
import { packTileset12 } from './pack-tileset12';
import { packTileset3 } from './pack-tileset3';
import { packMaps } from './pack-maps';
import { packStrings } from './pack-strings';
import { packDialogue } from './pack-dialogue';
import { packPortraits } from './pack-portraits';
import { packNamesprites } from './pack-namesprites';
import { packMenufont } from './pack-menufont';
import { packActors } from './pack-actors';
import { packCollision } from './pack-collision';
import { packExits } from './pack-exits';
import { packSpriteAnims } from './pack-sprite-anims';
import { packFont } from './pack-font';
import { packMover } from './pack-mover';
import { packSprites } from './pack-sprites';
import { packScripts } from './pack-scripts';
import { packWorld } from './pack-world';
import { packSound } from './pack-sound';
import { packLz } from './pack-lz';
import { packTables } from './pack-tables';

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
