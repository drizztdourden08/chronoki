/* @layer renderer-lib @kind logic */
import { KEYBOARD_DEFAULT, buildConsoleDefaultMappings } from '@chronoki/input-mapping';
import type { ButtonMapping } from '@chronoki/input-mapping';
import type { SdlGamepadType } from '@drizztdourden08/brock-input';
import type { DevicePreset } from './profile-edit.type';

const presetMappings = ({ sdlType, vid, pid }: DevicePreset): ButtonMapping[] => {
  const defaults = sdlType === 'keyboard'
    ? KEYBOARD_DEFAULT.defaultMappings
    : buildConsoleDefaultMappings({ sdlType: sdlType as SdlGamepadType, vendorId: vid, productId: pid });
  return defaults.map((m) => {
    const fromDevice = m.binding.type !== 'keyboard';
    return { ...m, icon: null, sourceVid: fromDevice ? vid : null, sourcePid: fromDevice ? pid : null };
  });
};

export { presetMappings };
