/* @layer bridge-wasm @kind logic */
import type { MsuBridge } from '@chronoki/game-core';
import { chronokiCore } from '../lifecycle/chronoki-core';
import { keepAudioRunning } from './keep-audio-running';

const startPollLoop = (bridge: MsuBridge): (() => void) => {
  let handle = 0;
  const tick = (): void => {
    if (chronokiCore.state().status === 'running') {
      keepAudioRunning();
      bridge.poll();
    }
    handle = requestAnimationFrame(tick);
  };
  handle = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(handle);
};

export { startPollLoop };
