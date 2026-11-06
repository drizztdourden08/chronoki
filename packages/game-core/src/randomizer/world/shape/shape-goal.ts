/* @layer bridge-wasm @kind logic */
import { CT_KIT } from '../ct-kit.constants';
import type { CtGoal } from '../ct-goal.type';
import type { CtEventSpec, CtRule } from '../ct-region-spec.type';
import { SHAPE_GOAL_EVENT } from './shape.constants';

const { has, optionSwitch } = CT_KIT;

const CK_GOAL_RULE: CtRule = optionSwitch('gameMode', [
  ['legacy-of-cyrus', has('beat-ozzie')],
  ['ice-age', has('beat-giga-gaia')],
], has('beat-lavos'));

const SHAPE_GOAL_SPEC: CtEventSpec = { id: SHAPE_GOAL_EVENT, rule: CK_GOAL_RULE };

const shapeGoal: CtGoal = (state) => state.has(SHAPE_GOAL_EVENT);

export { SHAPE_GOAL_SPEC, shapeGoal };
