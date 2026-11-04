/* @layer shared @kind types */
type FeatureKind = 'core-setting' | 'host' | 'dev';

type FeatureGroup = 'Display' | 'Audio' | 'Input' | 'Quality of life' | 'Dev';

type FeatureOrigin = 'belthasar' | 'chronoki';

interface FeatureIniKey {
  section: 'video' | 'timing';
  key: string;
}

interface FeatureDef {
  id: string;
  label: string;
  description: string;
  userMessage?: string;
  group: FeatureGroup;
  kind: FeatureKind;
  origin: FeatureOrigin;
  iniKey?: FeatureIniKey;
  default: boolean;
  requires: string[];
  suggests?: string[];
  affectsVanillaParity: boolean;
  live: boolean;
}

export type { FeatureDef, FeatureGroup, FeatureIniKey, FeatureKind, FeatureOrigin };
