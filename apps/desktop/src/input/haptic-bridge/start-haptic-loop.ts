/* @layer renderer-lib @kind logic */
import { pollHapticEvents } from '@chronoki/game-core';
import { chronokiCore } from '@app/game/lifecycle/chronoki-core';
import { onHapticEvent } from './on-haptic-event';

const startHapticLoop = (): (() => void) => {
  let handle = 0;
  const tick = (): void => {
    const calls = chronokiCore.state().status === 'running' ? chronokiCore.calls() : null;
    if (calls) pollHapticEvents(calls, onHapticEvent);
    handle = requestAnimationFrame(tick);
  };
  handle = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(handle);
};

export { startHapticLoop };
