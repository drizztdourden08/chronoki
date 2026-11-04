/* @layer renderer-lib @kind logic */
import type { InputProfile } from '@chronoki/input-mapping';
import { bindSnesButton } from './bind-snes-button';
import { NO_BINDING } from './profile-edit.constants';
import type { ClearSnesMappingParams } from './profile-edit.type';

const clearSnesMapping = ({ profile, button, mappingIndex }: ClearSnesMappingParams): InputProfile => {
  const sharesButton = profile.mappings.filter((m) => m.snesButton === button).length > 1;
  if (!sharesButton) return bindSnesButton({ profile, button, binding: NO_BINDING, vid: null, pid: null });
  return {
    ...profile,
    mappings: profile.mappings.filter((_, index) => index !== mappingIndex),
    modifiedAt: Date.now(),
  };
};

export { clearSnesMapping };
