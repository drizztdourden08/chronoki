/* @layer renderer-app @kind logic */
import type { AppSettings } from '@app/settings.type';
import { dropRetiredKeys } from './drop-retired-keys';
import { migrateAspect } from './migrate-aspect';
import { migrateFlippedDefaults } from './migrate-flipped-defaults';
import { migratePerfTitle } from './migrate-perf-title';
import { migrateKnownGates } from './migrate-known-gates';
import { ALWAYS_ON_GATES, NEW_DEFAULT_GATES } from './normalise-settings.constants';
import type { RawSettings } from './normalise-settings.type';

const withIds = (gates: readonly string[], ids: readonly string[]): string[] => [...gates, ...ids.filter((id) => !gates.includes(id))];

const normaliseSettings = (settings: AppSettings, stored?: RawSettings | null): AppSettings => {
  const raw: RawSettings = stored ?? settings;
  const { original: legacy, widescreenAspect, ...rest } = settings as RawSettings & AppSettings;
  const vanillaSafe = raw.vanillaSafe ?? raw.original ?? legacy ?? rest.vanillaSafe;
  const fromOldConfig = Array.isArray(raw.gates) && raw.vanillaSafe === undefined;
  const withDefaults = withIds(fromOldConfig ? withIds(rest.gates, NEW_DEFAULT_GATES) : rest.gates, ALWAYS_ON_GATES);
  const known = migrateKnownGates(withDefaults, raw.knownGates);
  const flipped = migrateFlippedDefaults(known.gates, raw.flippedDefaults);
  const legacyAspect = raw.aspectRatio === undefined ? (raw.widescreenAspect ?? widescreenAspect) : undefined;
  const aspectRatio = migrateAspect(rest.aspectRatio, legacyAspect, flipped.gates);
  return dropRetiredKeys({ ...rest, displayPerfInTitle: migratePerfTitle(rest.displayPerfInTitle, raw), vanillaSafe: vanillaSafe === true, gates: flipped.gates, knownGates: known.knownGates, flippedDefaults: flipped.flippedDefaults, aspectRatio });
};

export { normaliseSettings };
