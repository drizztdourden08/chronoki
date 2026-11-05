/* @layer renderer-app @kind logic */
import type { SettingLockCause } from '@drizztdourden08/brock-react';
import type { AppSettings } from '@app/settings.type';
import { isAudioDisabled } from './audio/is-audio-disabled';
import { effectiveGatesOf } from './effective-gates-of';
import { GATE_KEY_PREFIX, OPTION_KEY_FEATURE } from './gate-keys.constants';
import { isAspectRuleDisabled } from './is-aspect-rule-disabled';
import { hasUnmetRequires } from './has-unmet-requires';

const isSettingDisabled = (key: string, settings: AppSettings, lock: SettingLockCause | null): boolean => {
  if (key === 'pixelPerfect') return settings.viewportConstraint !== 'none';
  if (key === `${GATE_KEY_PREFIX}linearFiltering` && settings.pixelPerfect && settings.viewportConstraint === 'none') return true;
  if (isAspectRuleDisabled(key, settings)) return true;
  if (isAudioDisabled(key, settings)) return true;
  if (lock !== null) return true;
  if (hasUnmetRequires(key, settings)) return true;
  const parent = OPTION_KEY_FEATURE[key];
  return parent !== undefined && !effectiveGatesOf(settings).has(parent);
};

export { isSettingDisabled };
