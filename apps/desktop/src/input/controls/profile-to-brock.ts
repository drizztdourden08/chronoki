/* @layer renderer-components @kind logic */
import type { ActionBinding, InputProfile as BrockProfile } from '@drizztdourden08/brock-input';
import type { ButtonMapping, InputProfile } from '@chronoki/input-mapping';

const mappingToAction = ({ snesButton, ...rest }: ButtonMapping): ActionBinding => ({ ...rest, action: snesButton });

const profileToBrock = (profile: InputProfile): BrockProfile => ({
  ...profile,
  mappings: profile.mappings.map(mappingToAction),
});

export { mappingToAction, profileToBrock };
