/* @layer renderer-components @kind logic */
import { SNES_BUTTONS } from '@chronoki/input-mapping';
import type { InputProfile } from '@chronoki/input-mapping';
import { NO_BINDING } from '../profile-edit/profile-edit.constants';
import type { DisplayMapping } from './controls.type';

const buildDisplayMappings = (profile: InputProfile | null): DisplayMapping[] =>
  SNES_BUTTONS.flatMap((button) => {
    const bound = (profile?.mappings ?? [])
      .map((mapping, mappingIndex) => ({ mapping, mappingIndex }))
      .filter(({ mapping }) => mapping.snesButton === button);
    if (bound.length === 0) return [{ button, mappingIndex: -1, binding: NO_BINDING, icon: null }];
    return bound.map(({ mapping, mappingIndex }) => ({ button, mappingIndex, binding: mapping.binding, icon: mapping.icon, sourceVid: mapping.sourceVid, sourcePid: mapping.sourcePid }));
  });

export { buildDisplayMappings };
