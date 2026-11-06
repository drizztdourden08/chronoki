/* @layer bridge-wasm @kind logic */
import type { CtRegionSpec, CtRule } from '../ct-region-spec.type';
import type { CtModeId } from '../modes/ct-mode-def.type';

type ModeView = { id: CtModeId; specs: ReadonlyMap<string, CtRegionSpec> };

type PerModeRules<Key> = Map<Key, Map<CtModeId, CtRule | undefined>>;

const perModeRulesOf = <Key extends string>(
  views: readonly ModeView[],
  regionId: string,
  entriesOf: (spec: CtRegionSpec) => readonly (readonly [Key, CtRule | undefined])[],
  label: (key: Key) => string,
): PerModeRules<Key> => {
  const byKey: PerModeRules<Key> = new Map();
  for (const view of views) {
    const spec = view.specs.get(regionId);
    for (const [key, rule] of spec === undefined ? [] : entriesOf(spec)) {
      const perMode = byKey.get(key) ?? new Map<CtModeId, CtRule | undefined>();
      if (perMode.has(view.id)) throw new Error(`${label(key)} is defined twice in mode ${view.id}.`);
      perMode.set(view.id, rule);
      byKey.set(key, perMode);
    }
  }
  return byKey;
};

export type { ModeView, PerModeRules };
export { perModeRulesOf };
