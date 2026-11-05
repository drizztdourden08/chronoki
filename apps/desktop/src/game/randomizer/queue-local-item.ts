/* @layer bridge-wasm @kind logic */
import type { RandomizerLog } from '@drizztdourden08/brock-randomizer';
import type { DeliveryRequest } from '@drizztdourden08/brock-randomizer/session';
import { LOCAL_DELIVERY_SOURCE } from './chronoki-randomizer.constants';
import { itemLabelOf } from './item-label-of';
import type { LocalRun } from './local-run.type';
import { receiveLocalItem } from './receive-local-item';

const queueLocalItem = (
  run: LocalRun,
  checkId: string,
  tag: string,
  log: RandomizerLog,
  deliver: (request: DeliveryRequest<unknown>) => string | null,
): void => {
  const item = run.seed.plan.items.get(checkId);
  if (item === undefined || run.received.some((entry) => entry.checkId === checkId)) return;
  deliver({
    message: itemLabelOf(item),
    source: LOCAL_DELIVERY_SOURCE,
    action: { apply: () => receiveLocalItem(run, checkId, tag, log) },
  });
};

export { queueLocalItem };
