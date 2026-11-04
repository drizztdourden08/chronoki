/* @layer shared-storage @kind logic */
import type { AppSettings } from '@app/settings.type';
import { ENHANCED_CONFIG_OVERRIDES, VANILLA_CONFIG_OVERRIDES } from './profile-presets.constants';
import type { ProfilePresetId } from './profile-presets.type';

const applyProfilePreset = (id: ProfilePresetId): Partial<AppSettings> =>
  (id === 'vanilla' ? { ...VANILLA_CONFIG_OVERRIDES } : { ...ENHANCED_CONFIG_OVERRIDES });

export { applyProfilePreset };
