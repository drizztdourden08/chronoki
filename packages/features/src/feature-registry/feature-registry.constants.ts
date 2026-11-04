/* @layer shared @kind constants */
import type { FeatureDef } from '../feature.type';
import { CORE_FEATURES } from './core-features.constants';
import { HOST_FEATURES } from './host-features.constants';

const FEATURE_REGISTRY: readonly FeatureDef[] = [...CORE_FEATURES, ...HOST_FEATURES];

export { FEATURE_REGISTRY };
