/* @layer bridge-wasm @kind logic */
import { ctGoal } from './ct-goal';
import type { CtGoal } from './ct-goal.type';
import type { CtGoalId } from './modes/ct-mode-def.type';

const goalOf = (id: CtGoalId): CtGoal => {
  if (id === 'beat-lavos') return ctGoal;
  throw new Error(`Goal "${id}" is not available yet.`);
};

export { goalOf };
