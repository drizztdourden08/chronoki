/* @layer renderer-lib @kind logic */
import { isAutomationLaunch } from '@drizztdourden08/brock-react';
import { notifyQuietly } from '@chronoki/input-mapping';
import { routeInputFrame } from '../frame-router';
import type { InputManager } from './input-manager';

const inputEligible = (): boolean => document.hasFocus() || isAutomationLaunch();

const publishStates = (m: InputManager): void => {
  if (m.stateListeners.size === 0) return;
  if (m.hidStatesDirty) {
    m.currentHidStates = new Map(m.currentHidStates);
    m.hidStatesDirty = false;
  }
  notifyQuietly(m.stateListeners, m.currentHidStates, m.allPressedKeys);
};

const pollFrame = (m: InputManager): void => {
  if (!m.running) return;

  const windowFocused = inputEligible();

  if (windowFocused && !m.pauseManager.isPaused && !m.inputSuppressed) routeInputFrame(m);

  if (windowFocused && m.rawDispatcher.hasListeners) m.rawDispatcher.emitHidEvents(m.hidStates);

  if (windowFocused && m.setInputFn && !m.inputSuppressed && m.functionActions.hasMappedGamepadButtons) {
    m.functionActions.checkGamepads(m.hidStates, m.allowed);
  }

  publishStates(m);

  m.animFrameId = requestAnimationFrame(m.pollLoop);
};

export { pollFrame };
