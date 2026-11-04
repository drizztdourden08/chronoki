/* @layer renderer-components @kind logic */
import { SNES_BUTTONS } from '@chronoki/input-mapping';
import type { DetectedDevice, InputProfile } from '@chronoki/input-mapping';
import { NO_BINDING } from '../profile-edit/profile-edit.constants';
import type { DisplayMapping } from './controls.type';
import { resolveDisplayIcon } from './resolve-display-icon';

const buildDisplayMappings = (profile: InputProfile | null, devices: readonly DetectedDevice[] = []): DisplayMapping[] =>
  SNES_BUTTONS.flatMap((button): DisplayMapping[] => {
    const bound = (profile?.mappings ?? [])
      .map((mapping, mappingIndex) => ({ mapping, mappingIndex }))
      .filter(({ mapping }) => mapping.snesButton === button);
    if (bound.length === 0) return [{ button, mappingIndex: -1, binding: NO_BINDING, icon: null }];
    return bound.map(({ mapping, mappingIndex }) => ({ button, mappingIndex, binding: mapping.binding, icon: resolveDisplayIcon(mapping, devices), sourceVid: mapping.sourceVid, sourcePid: mapping.sourcePid }));
  });

export { buildDisplayMappings };
