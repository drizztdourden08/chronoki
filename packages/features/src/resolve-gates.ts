/* @layer shared @kind logic */
import { FEATURES_BY_ID } from './feature-registry/features-by-id.constants';
import { resolveFeatures } from './resolve-features';
import type { ResolveResult } from './resolve-features';
import type { ResolveGatesOptions } from './resolve-gates.type';

const resolveGates = (requested: Iterable<string>, options: ResolveGatesOptions): ResolveResult => {
  const { vanillaSafe, packaged = false, satisfied = new Set<string>() } = options;
  const allowed = (id: string): boolean => {
    const def = FEATURES_BY_ID[id];
    if (!def) return false;
    if (vanillaSafe && def.affectsVanillaParity) return false;
    return !(packaged && def.kind === 'dev');
  };
  return resolveFeatures([...requested].filter(allowed), satisfied);
};

export { resolveGates };
