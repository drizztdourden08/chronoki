/* @layer bridge-wasm @kind logic */
import { createRng } from '@drizztdourden08/brock-randomizer/world';
import { TAB_AMOUNT_STREAM, TAB_MAX_AMOUNT, TAB_VANILLA_AMOUNT } from './tab.constants';
import type { TabAmounts } from './tab-amounts.type';

const boundOf = (value: unknown): number =>
  typeof value === 'number' && Number.isInteger(value)
    ? Math.min(TAB_MAX_AMOUNT, Math.max(TAB_VANILLA_AMOUNT, value))
    : TAB_VANILLA_AMOUNT;

const tabAmountsOf = (options: Readonly<Record<string, unknown>>, seed: string): TabAmounts | null => {
  const rng = createRng(`${seed}${TAB_AMOUNT_STREAM}`);
  const rolled = (min: unknown, max: unknown): number => {
    const low = Math.min(boundOf(min), boundOf(max));
    return low + rng.int(Math.max(boundOf(min), boundOf(max)) - low + 1);
  };
  const amounts: TabAmounts = {
    power: rolled(options.powerTabMin, options.powerTabMax),
    magic: rolled(options.magicTabMin, options.magicTabMax),
    speed: rolled(options.speedTabMin, options.speedTabMax),
  };
  return Object.values(amounts).every((amount) => amount === TAB_VANILLA_AMOUNT) ? null : amounts;
};

export { tabAmountsOf };
