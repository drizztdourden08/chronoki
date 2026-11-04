/* @layer renderer-app @kind logic */
import type { AppSettings } from '@app/settings.type';
import { ALWAYS_ON_GATES, NEW_DEFAULT_GATES } from './normalise-settings.constants';

type RawSettings = Partial<AppSettings> & { original?: boolean };

const withIds = (gates: readonly string[], ids: readonly string[]): string[] => [...gates, ...ids.filter((id) => !gates.includes(id))];

const normaliseSettings = (settings: AppSettings, stored?: RawSettings | null): AppSettings => {
  const raw: RawSettings = stored ?? settings;
  const { original: legacy, ...rest } = settings as RawSettings & AppSettings;
  const oldFlag = raw.original ?? legacy;
  const vanillaSafe = oldFlag ?? raw.vanillaSafe ?? rest.vanillaSafe;
  const fromOldConfig = Array.isArray(raw.gates) && (oldFlag !== undefined || raw.vanillaSafe === undefined);
  const gates = fromOldConfig ? withIds(rest.gates, NEW_DEFAULT_GATES) : rest.gates;
  return { ...rest, vanillaSafe: vanillaSafe === true, gates: withIds(gates, ALWAYS_ON_GATES) };
};

export { normaliseSettings };
