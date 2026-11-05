/* @layer bridge-wasm @kind type */
import type { OptionKind, OptionRange } from '@drizztdourden08/brock-randomizer';

type CtOptionDoc = {
  group: string;
  description: string;
  kind?: OptionKind;
  range?: OptionRange;
};

export type { CtOptionDoc };
