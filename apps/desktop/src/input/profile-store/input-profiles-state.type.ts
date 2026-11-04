/* @layer renderer-lib @kind types */
import type { FunctionMapping, InputProfile } from '@chronoki/input-mapping';

interface InputProfilesState {
  activeProfileId: string | null;
  profiles: InputProfile[];
  functionMappings: FunctionMapping[];
}

export type { InputProfilesState };
