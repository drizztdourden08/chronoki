/* @layer bridge-wasm @kind logic */
import type { CtOptionValues } from '@chronoki/game-core';
import { CT_OPTION_CATALOG } from '@chronoki/game-core';
import { ctPoolOf } from './ct-pool-of';
import { NO_CHANGE, UNAVAILABLE } from './ct-pool-impact.constants';
import type { CtPool } from './ct-pool.type';
import type { CtPoolImpact } from './ct-pool-impact.type';

const itemsOf = (pool: CtPool): number => pool.progression.length + pool.rest.length;

const ctPoolImpactOf = (key: string, pack: Uint8Array, options: CtOptionValues, current: CtPool, seed: string): CtPoolImpact => {
  const option = CT_OPTION_CATALOG.find((each) => each.key === key);
  if (option === undefined || !option.implemented || option.frozen === true) return UNAVAILABLE;
  if (options[option.key] === option.default) return NO_CHANGE;
  const baseline = ctPoolOf(pack, { ...options, [option.key]: option.default }, seed);
  return { locations: current.locations - baseline.locations, items: itemsOf(current) - itemsOf(baseline), note: '' };
};

export { ctPoolImpactOf };
