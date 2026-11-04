/* @layer shared @kind barrel */
export { DEFAULT_GATES } from './default-gates.constants';
export { FEATURE_REGISTRY } from './feature-registry/feature-registry.constants';
export { FEATURES_BY_ID } from './feature-registry/features-by-id.constants';
export { DEFAULT_GATE_OPTIONS } from './gate-options/gate-options.constants';
export { lockCauseOf } from './lock-cause';
export { resolveFeatures } from './resolve-features';
export { resolveGates } from './resolve-gates';
export type { LockCause, LockCauseContext } from './lock-cause';
export type { AutoDisabledFeature, ResolveResult } from './resolve-features';
export type { GateOptions, RenderScaleFactor, WideAspect } from './gate-options/gate-options.type';
export type { FeatureDef, FeatureGroup, FeatureIniKey, FeatureKind, FeatureOrigin } from './feature.type';
export type { ResolveGatesOptions } from './resolve-gates.type';
