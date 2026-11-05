/* @layer bridge-wasm @kind logic */
import { localRunHolder } from '../local-run-holder';
import type { AppliedSeed } from '../local-run.type';

const currentAppliedSeed = (): AppliedSeed | null => localRunHolder.run?.seed ?? localRunHolder.applied;

export { currentAppliedSeed };
