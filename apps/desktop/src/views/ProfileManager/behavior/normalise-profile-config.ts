/* @layer renderer-components @kind logic */
import { normaliseSettings } from '@app/settings-effects/normalise-settings';
import { DEFAULT_SETTINGS } from '@app/settings.constants';

const normaliseProfileConfig = (raw: Record<string, unknown>): Record<string, unknown> => {
  const { original: _legacy, ...rest } = raw;
  const normalised = normaliseSettings({ ...DEFAULT_SETTINGS, ...rest }, raw);
  return { ...rest, vanillaSafe: normalised.vanillaSafe, ...(Array.isArray(rest.gates) ? { gates: normalised.gates } : {}) };
};

export { normaliseProfileConfig };
