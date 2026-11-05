/* @layer renderer-app @kind logic */
import type { SettingLockCause } from '@drizztdourden08/brock-react';
import type { AppSettings } from '@app/settings.type';
import { isAudioDisabled } from './audio/is-audio-disabled';
import { effectiveGatesOf } from './effective-gates-of';
import { GATE_KEY_PREFIX, OPTION_KEY_FEATURE } from './gate-keys.constants';
import { isAspectRuleDisabled } from './is-aspect-rule-disabled';
import { hasUnmetRequires } from './has-unmet-requires';

const isOwnRuleDisabled = (key: string, settings: AppSettings): boolean => {
  if (key === 'pixelPerfect') return settings.viewportConstraint !== 'none';
  if (key === 'dialogHoldSpeed') return !settings.dialogHoldToAccelerate;
  return key === `${GATE_KEY_PREFIX}linearFiltering` && settings.pixelPerfect && settings.viewportConstraint === 'none';
};

const isParentGateOff = (key: string, settings: AppSettings): boolean => {
  const parent = OPTION_KEY_FEATURE[key];
  return parent !== undefined && !effectiveGatesOf(settings).has(parent);
};

const isSettingDisabled = (key: string, settings: AppSettings, lock: SettingLockCause | null): boolean =>
  isOwnRuleDisabled(key, settings)
  || isAspectRuleDisabled(key, settings)
  || isAudioDisabled(key, settings)
  || lock !== null
  || hasUnmetRequires(key, settings)
  || isParentGateOff(key, settings);

export { isSettingDisabled };
