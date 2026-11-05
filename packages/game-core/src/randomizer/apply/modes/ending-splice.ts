/* @layer bridge-wasm @kind logic */
import type { ScriptSplice } from '../script/script-splice.type';
import { endingBytesOf } from './ending-bytes-of';
import type { EndingPoint } from './ending-splice.type';
import { opEquals } from './op-equals';

const endingSplice = (point: EndingPoint): ScriptSplice => {
  const ending = endingBytesOf(point.story);
  return {
    scene: point.scene,
    anchor: opEquals(point.anchor),
    replace: Uint8Array.from(point.place === 'before' ? [...ending, ...point.anchor] : [...point.anchor, ...ending]),
    why: point.why,
  };
};

export { endingSplice };
