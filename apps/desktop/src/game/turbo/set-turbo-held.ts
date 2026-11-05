/* @layer bridge-wasm @kind logic */
import { hostGate } from '@chronoki/game-core';
import { TURBO_GATE } from './turbo.constants';
import { turboState } from './turbo-state';

const setTurboHeld = (held: boolean): void => {
  const next = held && hostGate(TURBO_GATE);
  if (next === turboState.held) return;
  turboState.held = next;
  turboState.fraction = 0;
};

export { setTurboHeld };
