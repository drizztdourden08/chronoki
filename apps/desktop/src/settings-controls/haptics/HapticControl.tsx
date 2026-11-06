/* @layer renderer-app @kind component */
import { Slider, Toggle } from '@drizztdourden08/tessera/primitives';
import type { HapticSettings } from '@chronoki/input-mapping';
import { isHapticsSettingDisabled } from './is-haptics-disabled';
import { hapticPatch } from './haptic-patch';
import { HAPTIC_SLIDER, HAPTICS_PREFIX } from './haptics.constants';
import type { SettingControlProps } from '../settings-controls.type';

const HapticControl = ({ settingKey, settings, onChange }: SettingControlProps & { settingKey: string }) => {
  const field = settingKey.slice(HAPTICS_PREFIX.length) as keyof HapticSettings;
  const value = settings.haptics[field];
  const disabled = isHapticsSettingDisabled(settingKey, settings);
  if (typeof value === 'number') {
    return (
      <Slider
        value={value}
        {...HAPTIC_SLIDER}
        showValue
        formatValue={(next: number) => `${next}%`}
        disabled={disabled}
        onChange={(next: number) => onChange(hapticPatch(settings, field, next))}
      />
    );
  }
  return <Toggle checked={value} disabled={disabled} onChange={(next: boolean) => onChange(hapticPatch(settings, field, next))} />;
};

export { HapticControl };
