/* @layer bridge-wasm @kind fixture */
import type { CtCharacter } from '../../world/ct-world-keys.type';
import { packOf } from './pack-of.fixture';
import type { Blob } from './recruit-rando.fixture.type';
import { RECRUIT_SPOT_SCENES } from './recruit-spot-edits.constants';
import { sceneBlobs } from './scene-blobs.fixture';
import { scriptOf } from './script-of.fixture';

const syntheticRecruitPack = (skipScene?: number): Uint8Array => {
  let script = 0x100;
  const blobs = (Object.entries(RECRUIT_SPOT_SCENES) as [CtCharacter, readonly number[]][]).flatMap(([spot, scenes]) =>
    scenes.filter((scene) => scene !== skipScene).flatMap((scene): Blob[] => {
      script += 1;
      return [...sceneBlobs(scene, script), { type: 16, id: script, data: scriptOf(spot, spot) }];
    }));
  return packOf(blobs);
};

export { syntheticRecruitPack };
