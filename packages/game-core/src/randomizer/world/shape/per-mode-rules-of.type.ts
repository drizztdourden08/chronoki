/* @layer bridge-wasm @kind type */
import type { CtRegionSpec, CtRule } from '../ct-region-spec.type';
import type { CtModeId } from '../modes/ct-mode-def.type';

type ModeView = { id: CtModeId; specs: ReadonlyMap<string, CtRegionSpec> };

type PerModeRules<Key> = Map<Key, Map<CtModeId, CtRule | undefined>>;

export type { ModeView, PerModeRules };
