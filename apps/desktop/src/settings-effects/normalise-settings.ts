/* @layer renderer-app @kind logic */
import type { AppSettings } from '@app/settings.type';
import { ALWAYS_ON_GATES, NEW_DEFAULT_GATES } from './normalise-settings.constants';
import type { RawSettings } from './normalise-settings.type';

const withIds = (gates: readonly string[], ids: readonly string[]): string[] => [...gates, ...ids.filter((id) => !gates.includes(id))];

const normaliseSettings = (settings: AppSettings, stored?: RawSettings | null): AppSettings => {
  const raw: RawSettings = stored ?? settings;
  const { original: legacy, ...rest } = settings as RawSettings & AppSettings;
  const vanillaSafe = raw.vanillaSafe ?? raw.original ?? legacy ?? rest.vanillaSafe;
  const fromOldConfig = Array.isArray(raw.gates) && raw.vanillaSafe === undefined;
  const gates = fromOldConfig ? withIds(rest.gates, NEW_DEFAULT_GATES) : rest.gates;
  return { ...rest, vanillaSafe: vanillaSafe === true, gates: withIds(gates, ALWAYS_ON_GATES) };
};

export { normaliseSettings };
