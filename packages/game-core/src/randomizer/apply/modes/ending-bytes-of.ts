/* @layer bridge-wasm @kind logic */
import { encodeChangeLocation } from '../script/encode-change-location';
import { ENDING_JUMP_FLAGS, ENDING_JUMP_OP, ENDING_SCENE, OP_SET_STORY } from './ending-splice.constants';

const endingBytesOf = (story: number): number[] => [
  OP_SET_STORY,
  story,
  ...encodeChangeLocation(ENDING_SCENE, 0, 0, { op: ENDING_JUMP_OP, flags: ENDING_JUMP_FLAGS }),
];

export { endingBytesOf };
