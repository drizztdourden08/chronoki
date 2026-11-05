/* @layer bridge-wasm @kind type */
import type { CtRule } from '../ct-region-spec.type';
import type { CtCharacter, CtKeyItem, CtOptionKey, CtRegionId } from '../ct-world-keys.type';

type ObjectiveKind = 'boss' | 'quest' | 'recruit' | 'collect';

type ObjectiveSource =
  | { type: 'flag'; at: number; mask: number; settle: boolean }
  | { type: 'item'; itemId: number }
  | { type: 'joined'; character: CtCharacter }
  | { type: 'joinedCount'; count: number };

type ObjectiveDef = {
  id: string;
  label: string;
  kind: ObjectiveKind;
  source: ObjectiveSource;
  regions: readonly CtRegionId[];
  items: readonly CtKeyItem[];
  rule: CtRule;
  option?: CtOptionKey;
};

type ObjectiveRow = { id: string; label: string };

export type { ObjectiveDef, ObjectiveKind, ObjectiveRow, ObjectiveSource };
