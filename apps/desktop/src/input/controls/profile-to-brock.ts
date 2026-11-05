/* @layer renderer-components @kind logic */
import type { InputProfile as BrockProfile } from '@drizztdourden08/brock-input';
import type { InputProfile } from '@chronoki/input-mapping';
import { mappingToAction } from './mapping-to-action';

const profileToBrock = (profile: InputProfile): BrockProfile => ({
  ...profile,
  mappings: profile.mappings.map(mappingToAction),
});

export { profileToBrock };
