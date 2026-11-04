/* @layer shared @kind constants */
import { FEATURE_REGISTRY } from './feature-registry/feature-registry.constants';

const ALL_FEATURE_IDS: string[] = FEATURE_REGISTRY.map((feature) => feature.id);

export { ALL_FEATURE_IDS };
