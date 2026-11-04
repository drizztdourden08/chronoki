/* @layer bridge-wasm @kind logic */
import { hostGate } from '@chronoki/game-core';
import { chronokiCore } from '../lifecycle/chronoki-core';
import { setTurboHeld } from './set-turbo-held';
import { turboConfig } from './turbo-config';
import { TURBO_GATE } from './turbo.constants';
import { turboState } from './turbo-state';

const runExtraFrames = (): void => {
  const runFrame = chronokiCore.definition.core.exports.runFrame;
  const calls = chronokiCore.calls();
  if (!runFrame || !calls || chronokiCore.state().status !== 'running') return;
  for (let i = 0; i < turboConfig.speed - 1; i += 1) {
    calls.call(runFrame);
    turboState.extraFrames += 1;
  }
};

const startTurboLoop = (): (() => void) => {
  let handle = 0;
  const tick = (): void => {
    if (turboState.held && hostGate(TURBO_GATE)) runExtraFrames();
    else if (turboState.held) setTurboHeld(false);
    handle = requestAnimationFrame(tick);
  };
  handle = requestAnimationFrame(tick);
  const onBlur = (): void => setTurboHeld(false);
  window.addEventListener('blur', onBlur);
  return () => {
    cancelAnimationFrame(handle);
    window.removeEventListener('blur', onBlur);
    setTurboHeld(false);
  };
};

export { startTurboLoop };
