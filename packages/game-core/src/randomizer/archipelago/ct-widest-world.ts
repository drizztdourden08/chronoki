/* @layer bridge-wasm @kind logic */
import { createRng, worldGameFromDef } from '@drizztdourden08/brock-randomizer/world';
import type { World } from '@drizztdourden08/brock-randomizer/world';
import { createCtWorldDef } from '../world/create-ct-world-def';
import type { CtWorldKeys } from '../world/ct-world-keys.type';
import { CT_AP_LOCATION_IDS } from './ct-ap-location-ids.constants';
import { ctWidestChecks } from './ct-widest-checks';
import { CT_WIDEST_OPTIONS } from './ct-widest-options.constants';
import { WIDEST_SEED } from './ct-widest-world.constants';

const ctWidestWorld = (): World<CtWorldKeys> => {
  const def = createCtWorldDef({
    checks: ctWidestChecks(), options: CT_WIDEST_OPTIONS, fillerSeed: WIDEST_SEED, shape: 'one',
  });
  const regions = def.regions.map((region) => ({
    ...region,
    locations: region.locations.filter((location) => location.key in CT_AP_LOCATION_IDS),
  }));
  const game = worldGameFromDef({ ...def, regions });
  const request = { seed: WIDEST_SEED };
  return game.build({ request, prep: undefined, rng: createRng(WIDEST_SEED), attempt: 0 }).world;
};

export { ctWidestWorld };
