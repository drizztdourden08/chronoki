/* @layer shared @kind constants */
import type { FeatureDef } from '../feature.type';

// TODO(P2+): one record per non-original feature; the registry stays empty in the scaffold.
const FEATURE_REGISTRY: readonly FeatureDef[] = [];

export { FEATURE_REGISTRY };
