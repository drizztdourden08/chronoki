/* @layer bridge-wasm @kind logic */
import type { MsuBridge } from '@chronoki/game-core';
import { chronokiCore } from '../lifecycle/chronoki-core';

const startPollLoop = (bridge: MsuBridge): (() => void) => {
  let handle = 0;
  const tick = (): void => {
    if (chronokiCore.state().status === 'running') bridge.poll();
    handle = requestAnimationFrame(tick);
  };
  handle = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(handle);
};

export { startPollLoop };
