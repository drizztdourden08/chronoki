/* @layer bridge-wasm @kind logic */
import type { CtGoal } from './ct-goal.type';

const ctGoal: CtGoal = (state) => state.has('beat-lavos');

export { ctGoal };
