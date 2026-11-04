/* @layer shared @kind constants */
import { FEATURE_REGISTRY } from './feature-registry/feature-registry.constants';

const DEFAULT_GATES: string[] = FEATURE_REGISTRY.filter((feature) => feature.default).map((feature) => feature.id);

export { DEFAULT_GATES };
