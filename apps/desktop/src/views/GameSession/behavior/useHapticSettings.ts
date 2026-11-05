/* @layer renderer-appshell @kind hook */
import { useEffect } from 'react';
import { useSettings } from '@drizztdourden08/brock-react';
import { updateHapticBridgeSettings } from '@chronoki/input-mapping';
import type { AppSettings } from '@app/settings.type';

const useHapticSettings = (): boolean => {
  const { settings } = useSettings<AppSettings>();
  const { haptics, vanillaSafe } = settings;
  useEffect(() => { updateHapticBridgeSettings(haptics); }, [haptics]);
  return haptics.enabled && !vanillaSafe;
};

export { useHapticSettings };
