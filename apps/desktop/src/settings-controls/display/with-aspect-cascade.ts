/* @layer renderer-app @kind logic */
import { TALL_ASPECT_CHOICES, TALL_FALLBACK_ASPECT } from '@chronoki/features';
import type { AppSettings } from '@app/settings.type';
import { TALL_GATE } from './display.constants';

const tallTurnedOff = (patch: Partial<AppSettings>, current: AppSettings): boolean =>
  patch.gates !== undefined && current.gates.includes(TALL_GATE) && !patch.gates.includes(TALL_GATE);

const withAspectCascade = (patch: Partial<AppSettings>, current: AppSettings): Partial<AppSettings> => {
  if (!tallTurnedOff(patch, current) || !TALL_ASPECT_CHOICES.includes(current.aspectRatio)) return patch;
  return { aspectRatio: TALL_FALLBACK_ASPECT, ...patch };
};

export { withAspectCascade };
