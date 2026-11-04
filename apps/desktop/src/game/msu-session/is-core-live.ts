/* @layer bridge-wasm @kind logic */
import { chronokiCore } from '../lifecycle/chronoki-core';

const isCoreLive = (): boolean => {
  const { status } = chronokiCore.state();
  return status === 'running' || status === 'paused';
};

export { isCoreLive };
