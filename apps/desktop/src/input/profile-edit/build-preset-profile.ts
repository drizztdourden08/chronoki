/* @layer renderer-lib @kind logic */
import type { InputProfile } from '@chronoki/input-mapping';
import { padHexOrNull } from './pad-hex-or-null';
import { presetDeviceFamily } from './preset-device-family';
import { presetMappings } from './preset-mappings';
import type { DevicePreset } from './profile-edit.type';

const buildPresetProfile = (preset: DevicePreset, profile: InputProfile): InputProfile => {
  const vid = padHexOrNull(preset.vid) ?? '';
  const pid = padHexOrNull(preset.pid) ?? '';
  const isKeyboard = preset.sdlType === 'keyboard';
  const deviceFamily = presetDeviceFamily(preset.sdlType);
  return {
    ...profile,
    name: preset.deviceName,
    deviceType: isKeyboard ? 'keyboard' : 'gamepad',
    deviceFamily,
    mappings: presetMappings({ ...preset, vid, pid }),
    assignedDevice: isKeyboard ? null : { vendorId: vid, productId: pid, displayName: preset.deviceName, deviceFamily },
    modifiedAt: Date.now(),
  };
};

export { buildPresetProfile };
