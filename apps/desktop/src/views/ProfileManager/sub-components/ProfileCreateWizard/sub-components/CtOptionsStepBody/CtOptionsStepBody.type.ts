/* @layer renderer-components @kind types */
import type { RandomizerOptions } from '@drizztdourden08/brock-randomizer';
import type { CtOptionDef } from '@chronoki/game-core';

interface CtOptionsSlice {
  overrides: RandomizerOptions;
}

interface CtOptionsStepBodyProps {
  value: CtOptionsSlice;
  onChange: (patch: Partial<CtOptionsSlice>) => void;
}

interface CtOptionSection {
  id: string;
  title: string;
  keys: readonly CtOptionDef['key'][];
}

interface CtOptionFieldProps {
  option: CtOptionDef;
  value: unknown;
  onChange: (next: unknown) => void;
}

export type { CtOptionFieldProps, CtOptionSection, CtOptionsSlice, CtOptionsStepBodyProps };
