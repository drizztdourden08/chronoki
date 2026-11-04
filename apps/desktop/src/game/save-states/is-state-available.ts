/* @layer bridge-wasm @kind logic */
import type { CkSettings } from '@chronoki/game-core';
import type { GameCore } from '@drizztdourden08/brock-port-kit/renderer';
import { EXPORT_STATE_AVAILABLE } from './state-status.constants';

const isStateAvailable = (core: GameCore<CkSettings>): boolean => {
  const calls = core.calls();
  if (!calls || core.state().status !== 'running' || !calls.has(EXPORT_STATE_AVAILABLE)) return false;
  return calls.number(EXPORT_STATE_AVAILABLE) !== 0;
};

export { isStateAvailable };
