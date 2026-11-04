/* @layer renderer-lib @kind logic */
import type { InputProfile } from '@chronoki/input-mapping';
import { buildCustomProfile } from './build-custom-profile';
import { buildPresetProfile } from './build-preset-profile';
import type { DevicePreset } from './profile-edit.type';

const buildControllerProfile = (preset: DevicePreset, existingCount: number): InputProfile => {
  const base = buildCustomProfile(existingCount);
  return buildPresetProfile(preset, { ...base, name: `${preset.deviceName} ${existingCount + 1}` });
};

export { buildControllerProfile };
