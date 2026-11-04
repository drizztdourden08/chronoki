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
    name: 'go-mode',
    params: [],
    body: (state) => state.canReachRegion('lavos'),
  },
];

export { CT_HELPERS };
