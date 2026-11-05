/* @layer bridge-wasm @kind logic */
import { changeLocationTarget } from '../script/change-location-target';
import { isChangeLocation } from '../script/is-change-location';
import type { ScriptSplice } from '../script/script-splice.type';
import { buildStartBlock } from './build-start-block';
import type { CtStartState } from './ct-start-state.type';
import { INTRO_JUMP, INTRO_WORLD } from './start-block.constants';

const isIntroJump = (op: Uint8Array): boolean => isChangeLocation(op) && changeLocationTarget(op) === INTRO_WORLD;

const planStartState = (state: CtStartState): ScriptSplice => ({
  scene: 0,
  anchor: isIntroJump,
  replace: buildStartBlock(state, INTRO_JUMP),
  why: `start-state:${state.id}`,
});

export { planStartState };
