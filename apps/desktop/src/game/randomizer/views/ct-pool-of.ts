/* @layer bridge-wasm @kind logic */
import { createRng } from '@drizztdourden08/brock-randomizer/world';
import type { CtOptionValues } from '@chronoki/game-core';
import { createCtWorldGame, realWorldInputOfPack, resolveMysteryOptions, withCtOptionDefaults } from '@chronoki/game-core';
import type { CtPool } from './ct-pool.type';

const ctPoolOf = (pack: Uint8Array, options: CtOptionValues, seed: string): CtPool => {
  const resolved = resolveMysteryOptions(withCtOptionDefaults(options), seed);
  const game = createCtWorldGame(realWorldInputOfPack(pack, resolved));
  const built = game.build({ request: { seed }, prep: undefined, rng: createRng(seed), attempt: 0 });
  return { locations: built.world.locationsByKey.size, progression: built.progression, rest: built.rest };
};

export { ctPoolOf };
