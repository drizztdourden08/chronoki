/* @layer bridge-wasm @kind type */
import type { RuleOptionValue } from '@drizztdourden08/brock-randomizer/world';
import type { CtOptionKey } from './ct-world-keys.type';

type CtOptionDef = {
  key: CtOptionKey;
  label: string;
  jotFlag: string;
  default: RuleOptionValue;
  choices?: readonly RuleOptionValue[];
  frozen?: boolean;
  section: string;
  implemented: boolean;
  hint?: string;
  mystery?: number | Readonly<Record<string, number>>;
  choiceLabels?: Readonly<Record<string, string>>;
};

export type { CtOptionDef };
