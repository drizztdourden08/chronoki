/* @layer renderer-app @kind logic */
import { ALL_FEATURE_IDS, FEATURES_BY_ID } from '@chronoki/features';
import { GATES_ADDED_AFTER_FIRST_PROFILES } from './normalise-settings.constants';
import type { KnownGatesResult } from './migrate-known-gates.type';

const seenBefore = (stored: readonly string[] | undefined): readonly string[] =>
  stored ?? ALL_FEATURE_IDS.filter((id) => !GATES_ADDED_AFTER_FIRST_PROFILES.includes(id));

const migrateKnownGates = (gates: readonly string[], stored: readonly string[] | undefined): KnownGatesResult => {
  const known = seenBefore(stored);
  const fresh = ALL_FEATURE_IDS.filter((id) => FEATURES_BY_ID[id]?.default && !known.includes(id) && !gates.includes(id));
  return { gates: [...gates, ...fresh], knownGates: [...ALL_FEATURE_IDS] };
};

export { migrateKnownGates };
