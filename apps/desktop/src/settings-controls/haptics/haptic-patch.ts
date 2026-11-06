/* @layer renderer-app @kind logic */
import type { HapticSettings } from '@chronoki/input-mapping';
import type { AppSettings } from '@app/settings.type';

const hapticPatch = (settings: AppSettings, field: keyof HapticSettings, value: boolean | number): Partial<AppSettings> => ({
  haptics: { ...settings.haptics, [field]: value },
});

export { hapticPatch };
