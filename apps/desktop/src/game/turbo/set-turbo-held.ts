/* @layer bridge-wasm @kind logic */
import { hostGate } from '@chronoki/game-core';
import { activeGameHolder } from '../lifecycle/active-game-holder';
import { TURBO_GATE } from './turbo.constants';
import { turboState } from './turbo-state';

const setTurboHeld = (held: boolean): void => {
  const next = held && hostGate(TURBO_GATE);
  if (next === turboState.held) return;
  turboState.held = next;
  turboState.muted = next;
  activeGameHolder.current?.session.audio.setVolume(next ? 0 : turboState.volume);
};

export { setTurboHeld };
