/* @layer renderer-lib @kind types */
import type { GameCore } from '@drizztdourden08/brock-port-kit/renderer';
import type { FunctionAction } from '@chronoki/input-mapping';

interface StartInputArgs {
  core: GameCore;
  profileId: string;
  onFunctionAction: (action: FunctionAction) => void;
  onFunctionRelease?: (action: FunctionAction) => void;
}

interface InputHandle {
  stop: () => void;
  cycleActiveProfile: (direction: 1 | -1) => void;
  isPaused: () => boolean;
}

export type { InputHandle, StartInputArgs };
