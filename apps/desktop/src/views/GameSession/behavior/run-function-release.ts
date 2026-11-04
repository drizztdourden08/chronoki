/* @layer renderer-appshell @kind logic */
import { setTurboHeld } from '@app/game/turbo';
import type { FunctionAction } from '@chronoki/input-mapping';

const runFunctionRelease = (action: FunctionAction): void => {
  if (action === 'fast-forward') setTurboHeld(false);
};

export { runFunctionRelease };
