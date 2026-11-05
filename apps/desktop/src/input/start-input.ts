/* @layer renderer-lib @kind logic */
import { FUNCTION_ACTIONS } from '@chronoki/input-mapping';
import { getInputManager } from './input-manager/get-input-manager';
import { loadInputState } from './profile-store/load-input-state';
import { SET_INPUT_CALL } from './input.constants';
import { OVERLAY_OWNED_ACTIONS } from './overlay-owned-actions.constants';
import type { InputHandle, StartInputArgs } from './start-input.type';

const startInput = ({ core, profileId, onFunctionAction, onFunctionRelease }: StartInputArgs): InputHandle => {
  const m = getInputManager();
  m.setWasmBridge((mask) => core.calls()?.call(SET_INPUT_CALL, mask));
  const unsubscribers = FUNCTION_ACTIONS
    .filter((action) => action !== 'pause' && !OVERLAY_OWNED_ACTIONS.has(action))
    .map((action) => m.onFunctionAction(action, () => onFunctionAction(action)));
  const unsubscribeRelease = m.functionActions.onKeyUp((action) => onFunctionRelease?.(action));
  m.functionActions.onPauseToggle = () => {
    m.pauseManager.togglePause();
    onFunctionAction('pause');
  };
  void loadInputState(m, profileId);

  const stop = (): void => {
    for (const unsubscribe of unsubscribers) unsubscribe();
    m.functionActions.onPauseToggle = () => m.pauseManager.togglePause();
    m.functionActions.clearHeld();
    unsubscribeRelease();
    m.keyStates.clear();
    m.setInputFn?.(0);
    m.setWasmBridge(null);
    m.resume();
  };

  return { stop, cycleActiveProfile: (direction) => m.cycleActiveProfile(direction), isPaused: () => m.isPaused() };
};

export { startInput };
