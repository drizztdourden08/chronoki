/* @layer bridge-wasm @kind logic */
import { ctGiveActionOf } from '@chronoki/game-core';
import { appRandomizerLog } from '@drizztdourden08/brock-randomizer/renderer';
import { giveCtAction } from '../randomizer/give-ct-action';
import { localRunHolder } from '../randomizer/local-run-holder';
import { receiveLocalItem } from '../randomizer/receive-local-item';
import { currentAppliedSeed } from '../randomizer/tracker/current-applied-seed';

const COLLECT_TAG = '[cheats]';

const cheatCollectCheck = (checkId: string): boolean => {
  const item = currentAppliedSeed()?.plan.items.get(checkId);
  if (item === undefined) return false;
  const action = ctGiveActionOf(item);
  if (action !== null && giveCtAction(action) !== 'settled') return false;
  const run = localRunHolder.run;
  if (run !== null) receiveLocalItem(run, checkId, COLLECT_TAG, appRandomizerLog);
  return true;
};

export { cheatCollectCheck };
