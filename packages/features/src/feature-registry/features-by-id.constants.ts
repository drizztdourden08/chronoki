/* @layer shared @kind constants */
import type { FeatureDef } from '../feature.type';
import { FEATURE_REGISTRY } from './feature-registry.constants';

const FEATURES_BY_ID: Readonly<Record<string, FeatureDef>> = Object.fromEntries(
  FEATURE_REGISTRY.map((feature) => [feature.id, feature]),
);

export { FEATURES_BY_ID };
