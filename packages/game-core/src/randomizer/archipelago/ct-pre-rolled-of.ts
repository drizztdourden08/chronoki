/* @layer bridge-wasm @kind logic */
import { preRolledOf } from '@drizztdourden08/brock-randomizer/archipelago';
import type { PreRolled } from '@drizztdourden08/brock-randomizer/archipelago';
import { effectiveOptionsOf } from '../world/modes/effective-options-of';
import type { CtWorldInput } from '../world/ct-world-input.type';
import { rollCtNonItem } from '../world/roll-ct-non-item';
import { withCtOptionDefaults } from '../world/with-ct-option-defaults';
import { ctFillWorldOf } from './ct-fill-world-of';
import { ctWorldModelHooks } from './ct-world-model-hooks';

const ctPreRolledOf = (rawInput: CtWorldInput, seed: string): PreRolled => {
  const { options } = rollCtNonItem({ ...rawInput, options: withCtOptionDefaults(rawInput.options) }, seed);
  return preRolledOf({
    fillWorld: ctFillWorldOf(rawInput, seed),
    options: { ...effectiveOptionsOf(options) },
    hooks: ctWorldModelHooks,
  });
};

export { ctPreRolledOf };
