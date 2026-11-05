/* @layer bridge-wasm @kind logic */
import { createRng } from '@drizztdourden08/brock-randomizer/world';
import type { CtOptionValues } from '../ct-world-input.type';
import { CT_OPTION_CATALOG } from '../ct-options.constants';
import { MYSTERY_STREAM } from './mystery-weights.constants';
import { pickMysteryValue } from './pick-mystery-value';

const rollMysteryOptions = (seed: string): CtOptionValues => {
  const rng = createRng(`${seed}${MYSTERY_STREAM}`);
  return Object.fromEntries(
    CT_OPTION_CATALOG.filter((option) => option.implemented && option.mystery !== undefined && option.frozen !== true)
      .map((option) => [option.key, pickMysteryValue(option, rng.next())]),
  );
};

export { rollMysteryOptions };
