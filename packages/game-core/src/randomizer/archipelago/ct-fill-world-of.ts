/* @layer bridge-wasm @kind logic */
import type { ModelFillWorld } from '@drizztdourden08/brock-randomizer/archipelago';
import { createRng } from '@drizztdourden08/brock-randomizer/world';
import { createCtWorldGame } from '../world/create-ct-world-game';
import type { CtWorldInput } from '../world/ct-world-input.type';
import type { CtWorldKeys } from '../world/ct-world-keys.type';
import { PIN_SPOTS_PHASE_ID } from '../world/pin-spots-phase.constants';
import { rollCtNonItem } from '../world/roll-ct-non-item';
import { withCtOptionDefaults } from '../world/with-ct-option-defaults';

const ctFillWorldOf = (rawInput: CtWorldInput, seed: string): ModelFillWorld<CtWorldKeys> => {
  const { input } = rollCtNonItem({ ...rawInput, options: withCtOptionDefaults(rawInput.options) }, seed);
  const game = createCtWorldGame({ ...input, shape: 'one' });
  const rng = createRng(seed);
  const build = game.build({ request: { seed }, prep: undefined, rng, attempt: 0 });
  game.fillPhases.filter((phase) => phase.id === PIN_SPOTS_PHASE_ID).forEach((phase) => phase.run(build, rng));
  const lockedVanilla = new Map(
    [...build.world.placedItems].map(([location, item]): [string, string] => [String(location), String(item)]),
  );
  build.world.placedItems.clear();
  return {
    world: build.world,
    pool: { progression: build.progression, useful: [], filler: build.rest },
    lockedVanilla,
  };
};

export { ctFillWorldOf };
