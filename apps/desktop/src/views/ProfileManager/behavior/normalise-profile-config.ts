/* @layer renderer-components @kind logic */
import { normaliseSettings } from '@app/settings-effects/normalise-settings';
import { DEFAULT_SETTINGS } from '@app/settings.constants';

const normaliseProfileConfig = (raw: Record<string, unknown>): Record<string, unknown> => {
  const { original: _legacy, widescreenAspect: _wide, ...rest } = raw;
  const hasAspect = 'widescreenAspect' in raw || 'aspectRatio' in raw;
  const normalised = normaliseSettings({ ...DEFAULT_SETTINGS, ...rest }, raw);
  return { ...rest, vanillaSafe: normalised.vanillaSafe, ...(hasAspect ? { aspectRatio: normalised.aspectRatio } : {}),...(Array.isArray(rest.gates) ? { gates: normalised.gates } : {}) };
};

export { normaliseProfileConfig };
