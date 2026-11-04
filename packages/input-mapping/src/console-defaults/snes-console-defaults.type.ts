/* @layer shared-input @kind types */
import type { SdlAxisName, SdlButtonName } from '@drizztdourden08/brock-input';
import type { SnesButton } from '../snes/snes.type';

interface AxisConsoleDefault {
  readonly '-'?: SnesButton;
  readonly '+'?: SnesButton;
}

interface SnesConsoleDefaults {
  readonly buttons: Partial<Record<SdlButtonName, SnesButton>>;
  readonly axes?: Partial<Record<SdlAxisName, AxisConsoleDefault>>;
  readonly unbound?: readonly SdlButtonName[];
}

export type { AxisConsoleDefault, SnesConsoleDefaults };
