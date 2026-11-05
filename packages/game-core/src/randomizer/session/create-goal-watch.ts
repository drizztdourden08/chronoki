/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import { CT_WRAM_REGION } from '../memory/ct-memory.constants';
import type { GoalBit } from './goal-watch.type';
import type { ModeHook } from './mode-hook.type';

const createGoalWatch = (goal: GoalBit, onGoal: () => void = () => undefined): ModeHook => {
  let reached = false;
  let previous: boolean | null = null;
  return {
    observe: (view: MemoryView, started: boolean): void => {
      if (!started || reached) return;
      const set = (view.byte(CT_WRAM_REGION, goal.at) & goal.mask) !== 0;
      const fired = goal.edge ? set && previous === false : set;
      previous = set;
      if (!fired) return;
      reached = true;
      onGoal();
    },
    goalReached: () => reached,
    reset: () => {
      reached = false;
      previous = null;
    },
  };
};

export { createGoalWatch };
