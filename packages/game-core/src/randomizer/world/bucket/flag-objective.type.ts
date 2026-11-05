/* @layer bridge-wasm @kind type */
import type { CtRule } from '../ct-region-spec.type';
import type { CtKeyItem, CtOptionKey, CtRegionId } from '../ct-world-keys.type';
import type { ObjectiveKind } from './objective-def.type';

type FlagObjectiveInput = {
  id: string;
  label: string;
  kind: ObjectiveKind;
  at: number;
  mask: number;
  settle: boolean;
  regions: readonly CtRegionId[];
  rule: CtRule;
  items?: readonly CtKeyItem[];
  option?: CtOptionKey;
  bank7e?: boolean;
};

export type { FlagObjectiveInput };
