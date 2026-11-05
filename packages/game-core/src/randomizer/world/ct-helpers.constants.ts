/* @layer bridge-wasm @kind constants */
import type { HelperDefinition, World } from '@drizztdourden08/brock-randomizer/world';
import type { CtWorldKeys } from './ct-world-keys.type';

const CT_HELPERS: readonly HelperDefinition<World<CtWorldKeys>>[] = [
  {
    name: 'sun-stone-charged',
    params: [],
    body: (state) =>
      state.has('moon-stone') && state.canReachRegion('prehistory') && state.canReachRegion('future'),
  },
  {
    name: 'sealed-open',
    params: [],
    body: (state) =>
      state.has('pendant')
      && (state.world.readOption('earlyPendantCharge') === true
        || state.canReachRegion('tyrano-lair') || state.canReachRegion('magus-castle')),
  },
  {
    name: 'go-mode',
    params: [],
    body: (state) => state.canReachRegion('lavos'),
  },
];

export { CT_HELPERS };
