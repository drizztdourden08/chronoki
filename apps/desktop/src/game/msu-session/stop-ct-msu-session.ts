/* @layer bridge-wasm @kind logic */
import { disposeMsuSession } from '@drizztdourden08/brock-msu/session';
import { msuRuntime } from './msu-runtime';

const stopCtMsuSession = (): void => {
  msuRuntime.generation += 1;
  msuRuntime.stopPoll?.();
  msuRuntime.stopPoll = null;
  msuRuntime.packName = null;
  const bridge = msuRuntime.bridge;
  msuRuntime.bridge = null;
  disposeMsuSession();
  bridge?.reset();
};

export { stopCtMsuSession };
