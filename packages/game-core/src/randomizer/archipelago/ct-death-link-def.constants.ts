/* @layer bridge-wasm @kind constants */
import type { ApOptionDef } from '@drizztdourden08/brock-randomizer/archipelago';

const CT_DEATH_LINK_DEF: ApOptionDef = {
  key: 'death_link',
  kind: 'toggle',
  displayName: 'Death Link',
  description: 'Dying sends everyone else in the session to their death too.',
  baseline: false,
  locked: false,
};

export { CT_DEATH_LINK_DEF };
