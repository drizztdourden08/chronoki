/* @layer bridge-wasm @kind fixture */
import type { CtCharacter } from '../../world/ct-world-keys.type';
import { le16 } from './le16.fixture';
import { le32 } from './le32.fixture';
import type { Blob } from './recruit-rando.fixture.type';
import { RECRUIT_SPOT_SCENES } from './recruit-spot-edits.constants';
import { scriptOf } from './script-of.fixture';

const sceneBlobs = (scene: number, script: number): Blob[] => [
  { type: 3, id: scene, data: [0, 0, 0, 0, 0, 0, 0, 0, ...le16(script), 0, 0] },
];

const packOf = (blobs: Blob[]): Uint8Array => {
  const bytes: number[] = [0x43, 0x54, 0x41, 0x53, ...le32(1), ...le32(blobs.length)];
  let at = 12 + blobs.length * 16;
  blobs.forEach((b) => {
    bytes.push(...le32(b.type), ...le32(b.id), ...le32(at), ...le32(b.data.length));
    at += b.data.length;
  });
  blobs.forEach((b) => bytes.push(...b.data));
  return Uint8Array.from(bytes);
};

const syntheticRecruitPack = (skipScene?: number): Uint8Array => {
  let script = 0x100;
  const blobs = (Object.entries(RECRUIT_SPOT_SCENES) as [CtCharacter, readonly number[]][]).flatMap(([spot, scenes]) =>
    scenes.filter((scene) => scene !== skipScene).flatMap((scene): Blob[] => {
      script += 1;
      return [...sceneBlobs(scene, script), { type: 16, id: script, data: scriptOf(spot, spot) }];
    }));
  return packOf(blobs);
};

export { packOf, sceneBlobs, syntheticRecruitPack };
