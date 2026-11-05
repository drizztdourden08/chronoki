/* @layer bridge-wasm @kind logic */
import { encodeChangeLocation } from '../script/encode-change-location';
import type { ScriptSplice } from '../script/script-splice.type';
import { ENDING_JUMP_FLAGS, ENDING_JUMP_OP, ENDING_SCENE, OP_SET_STORY } from './ending-splice.constants';
import type { EndingPoint } from './ending-splice.type';
import { opEquals } from './op-equals';

const endingBytesOf = (story: number): number[] => [
  OP_SET_STORY,
  story,
  ...encodeChangeLocation(ENDING_SCENE, 0, 0, { op: ENDING_JUMP_OP, flags: ENDING_JUMP_FLAGS }),
];

const endingSplice = (point: EndingPoint): ScriptSplice => {
  const ending = endingBytesOf(point.story);
  return {
    scene: point.scene,
    anchor: opEquals(point.anchor),
    replace: Uint8Array.from(point.place === 'before' ? [...ending, ...point.anchor] : [...point.anchor, ...ending]),
    why: point.why,
  };
};

export { endingBytesOf, endingSplice };
