/* @layer bridge-wasm @kind logic */
import type { RandomizerLog } from '@drizztdourden08/brock-randomizer';
import { itemLabelOf } from './item-label-of';
import type { LocalRun } from './local-run.type';

const receiveLocalItem = (run: LocalRun, checkId: string, tag: string, log: RandomizerLog): void => {
  const item = run.seed.plan.items.get(checkId);
  if (item === undefined || run.received.some((entry) => entry.checkId === checkId)) return;
  run.received.push({ checkId, item });
  log(`${tag} Received ${itemLabelOf(item)} from ${checkId} (${run.received.length} found)`);
};

export { receiveLocalItem };
