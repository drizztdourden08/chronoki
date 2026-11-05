/* @layer bridge-wasm @kind logic */
import type { ScriptSplice } from '../script/script-splice.type';
import type { ModeSplicer } from '../mode-splicer.type';
import { endingSplice } from './ending-splice';
import { ICE_AGE_ENDING, STORY_WRITES } from './ice-age-splices.constants';
import { opEquals } from './op-equals';
import type { StoryWrite } from './story-write.type';

const removeStoryWrite = (write: StoryWrite): ScriptSplice => ({
  scene: write.scene,
  anchor: opEquals(write.bytes),
  replace: new Uint8Array(0),
  why: write.why,
});

const iceAgeSplices: ModeSplicer = () => [...STORY_WRITES.map(removeStoryWrite), endingSplice(ICE_AGE_ENDING)];

export { iceAgeSplices };
