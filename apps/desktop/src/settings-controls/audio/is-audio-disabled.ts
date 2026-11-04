/* @layer renderer-app @kind logic */
import type { AppSettings } from '@app/settings.type';
import { GROUP_VOLUME_KEYS, PACK_DEPENDENT_KEYS } from './audio-controls.constants';
import { hasPackFormat } from './has-pack-format';

const isAudioDisabled = (key: string, settings: AppSettings): boolean => {
  if (GROUP_VOLUME_KEYS.includes(key)) return !settings.gates.includes('perGroupVolume');
  if (PACK_DEPENDENT_KEYS.includes(key)) return settings.vanillaSafe || !hasPackFormat(settings);
  if (key === 'msuConfigMode') return settings.vanillaSafe;
  if (key === 'enableMSU') return settings.vanillaSafe || settings.msuConfigMode === 'auto';
  return false;
};

export { isAudioDisabled };
