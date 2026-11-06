/* @layer bridge-wasm @kind logic */
import type { PollEntry } from '@drizztdourden08/brock-randomizer/session';
import { localRunHolder } from '../local-run-holder';
import { GOAL_KEY } from './chronoki-ap-goal.constants';

const chronokiApGoal = (): PollEntry => ({
  key: GOAL_KEY,
  checkId: GOAL_KEY,
  probe: { custom: () => localRunHolder.run?.start.goalReached() === true },
});

export { chronokiApGoal };
