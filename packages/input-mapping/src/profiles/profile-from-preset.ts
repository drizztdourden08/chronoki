/* @layer renderer-lib @kind logic */
import type { DevicePreset, InputProfile } from './profiles.type';

const profileFromPreset = (preset: DevicePreset): InputProfile => ({
  id: `default-${preset.id}`,
  name: preset.name,
  deviceType: preset.family === 'keyboard' ? 'keyboard' : 'gamepad',
  deviceFamily: preset.family,
  mappings: [...preset.defaultMappings],
  isDefault: true,
  assignedDevice: null,
  createdAt: Date.now(),
  modifiedAt: Date.now(),
});

export { profileFromPreset };
