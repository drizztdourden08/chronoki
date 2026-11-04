/* @layer renderer-components @kind types */
import type { FunctionMapping, InputProfile } from '@chronoki/input-mapping';
import type { ControlsState } from './controls.type';

interface MutationArgs {
  activeProfile: InputProfile | null;
  profiles: InputProfile[];
  functionMappings: FunctionMapping[];
  sync: () => void;
}

type Mutations = Pick<ControlsState, 'newlyCreatedId' | 'select' | 'create' | 'rename' | 'remove' | 'bindSnes' | 'clearSnes' | 'bindFunction' | 'clearFunction' | 'createForDevice' | 'applyToActive'>;

export type { MutationArgs, Mutations };
