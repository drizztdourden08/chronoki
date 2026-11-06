/* @layer bridge-wasm @kind constants */
import type { HelperDefinition, World } from '@drizztdourden08/brock-randomizer/world';
import { CT_KIT } from './ct-kit.constants';
import type { CtWorldKeys } from './ct-world-keys.type';

const { all, any, has, option, region } = CT_KIT;

const CT_HELPERS: readonly HelperDefinition<World<CtWorldKeys>>[] = [
  {
    name: 'sun-stone-charged',
    params: [],
    body: (state) =>
      state.has('moon-stone') && state.canReachRegion('prehistory') && state.canReachRegion('future'),
    expand: () => all(has('moon-stone'), region('prehistory'), region('future')),
  },
  {
    name: 'sealed-open',
    params: [],
    body: (state) =>
      state.has('pendant')
      && (state.world.readOption('earlyPendantCharge') === true
        || state.canReachRegion('tyrano-lair') || state.canReachRegion('magus-castle')),
    expand: () => all(
      has('pendant'),
      any(option('earlyPendantCharge', true), region('tyrano-lair'), region('magus-castle')),
    ),
  },
  {
    name: 'go-mode',
    params: [],
    body: (state) => state.canReachRegion('lavos'),
    expand: () => region('lavos'),
  },
];

export { CT_HELPERS };
