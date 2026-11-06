/* @layer bridge-wasm @kind logic */
import type { CtGoal } from '../ct-goal.type';
import { SHAPE_GOAL_EVENT } from './shape.constants';

const shapeGoal: CtGoal = (state) => state.has(SHAPE_GOAL_EVENT);

export { shapeGoal };
