/* @layer renderer-app @kind logic */
import type { SettingItem } from '@drizztdourden08/brock-react';
import { FEATURES_BY_ID } from '@chronoki/features';
import { GATE_KEY_PREFIX } from './gate-keys.constants';

const gateItem = (id: string): SettingItem => {
  const feature = FEATURES_BY_ID[id];
  if (!feature) throw new Error(`Unknown feature "${id}"`);
  return { key: `${GATE_KEY_PREFIX}${id}`, label: feature.label, description: feature.description, hint: feature.userMessage };
};

export { gateItem };
