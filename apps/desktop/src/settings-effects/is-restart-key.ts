/* @layer renderer-app @kind logic */
import { FEATURES_BY_ID } from '@chronoki/features';
import { featureIdOf } from '@app/settings-controls/feature-id-of';
import { RESTART_ALWAYS_KEYS } from './settings-effects.constants';

const isRestartKey = (key: string): boolean => {
  if (RESTART_ALWAYS_KEYS.includes(key)) return true;
  const id = featureIdOf(key);
  return id !== null && FEATURES_BY_ID[id]?.live === false;
};

export { isRestartKey };
