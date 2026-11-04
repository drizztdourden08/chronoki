/* @layer shared @kind logic */
import { FEATURES_BY_ID } from '../feature-registry/features-by-id.constants';
import type { AutoDisabledFeature, ResolveResult } from './resolve-features.type';

const missingOf = (id: string, effective: ReadonlySet<string>, satisfied: ReadonlySet<string>): string[] => {
  const def = FEATURES_BY_ID[id];
  if (!def) return [];
  const features = def.requires.filter((required) => !effective.has(required));
  const data = (def.requiresData ?? []).filter((required) => !satisfied.has(required));
  return [...features, ...data];
};

const resolveFeatures = (enabled: Iterable<string>, satisfied: ReadonlySet<string> = new Set()): ResolveResult => {
  const effective = new Set(enabled);
  const autoDisabled: AutoDisabledFeature[] = [];
  let changed = true;
  while (changed) {
    changed = false;
    for (const id of [...effective]) {
      const missing = missingOf(id, effective, satisfied);
      if (missing.length === 0) continue;
      effective.delete(id);
      autoDisabled.push({ id, missing });
      changed = true;
    }
  }
  return { effective, autoDisabled };
};

export { resolveFeatures };
