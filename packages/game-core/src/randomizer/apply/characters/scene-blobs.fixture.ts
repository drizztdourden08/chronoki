/* @layer bridge-wasm @kind fixture */
import { le16 } from './le16.fixture';
import type { Blob } from './recruit-rando.fixture.type';

const sceneBlobs = (scene: number, script: number): Blob[] => [
  { type: 3, id: scene, data: [0, 0, 0, 0, 0, 0, 0, 0, ...le16(script), 0, 0] },
];

export { sceneBlobs };
