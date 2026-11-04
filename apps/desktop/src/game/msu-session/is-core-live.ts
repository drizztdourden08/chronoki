/* @layer bridge-wasm @kind logic */
import { chronokiCore } from '../lifecycle/chronoki-core';
import { replanStore } from '../lifecycle/replan-store';

const isCoreLive = (): boolean => {
  if (replanStore.get()) return false;
  const { status } = chronokiCore.state();
  return status === 'running' || status === 'paused';
};

export { isCoreLive };
