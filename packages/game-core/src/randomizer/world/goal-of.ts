/* @layer bridge-wasm @kind logic */
import { ctGoal } from './ct-goal';
import type { CtGoal } from './ct-goal.type';
import type { CtEventId } from './ct-world-keys.type';
import type { CtGoalId } from './modes/ct-mode-def.type';

const goalOf = (id: CtGoalId, event?: CtEventId): CtGoal => {
  if (event !== undefined) return (state) => state.has(event);
  if (id === 'beat-lavos') return ctGoal;
  throw new Error(`Goal "${id}" is not available yet.`);
};

export { goalOf };
