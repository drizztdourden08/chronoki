/* @layer renderer-app @kind logic */
import { FEATURES_BY_ID } from '@chronoki/features';
import type { AppSettings } from '@app/settings.type';
import { effectiveGatesOf } from './effective-gates-of';
import { featureIdOf } from './feature-id-of';

const hasUnmetRequires = (key: string, settings: AppSettings): boolean => {
  const id = featureIdOf(key);
  const enabled = effectiveGatesOf(settings);
  return (id === null ? undefined : FEATURES_BY_ID[id])?.requires.some((required) => !enabled.has(required)) === true;
};

export { hasUnmetRequires };
