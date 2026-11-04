/* @layer renderer-appshell @kind logic */
import { setTurboHeld } from '@app/game/turbo';
import type { FunctionAction } from '@chronoki/input-mapping';
import { releaseSaveKey } from './release-save-key';

const runFunctionRelease = (action: FunctionAction): void => {
  if (action === 'fast-forward') setTurboHeld(false);
  if (action === 'save-state') void releaseSaveKey();
};

export { runFunctionRelease };
