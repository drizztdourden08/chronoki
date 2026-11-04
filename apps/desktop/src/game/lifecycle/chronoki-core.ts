/* @layer bridge-wasm @kind logic */
import { createGameCore } from '@drizztdourden08/brock-port-kit/renderer';
import { CHRONOKI_PORT, CRASH_ARM_DELAY_MS } from '@chronoki/game-core';
import { handleCoreCrash } from './handle-core-crash';
import { precompiledCore } from './precompiled-core';

const chronokiCore = createGameCore(CHRONOKI_PORT, {
  precompiled: precompiledCore,
  crashArmDelayMs: CRASH_ARM_DELAY_MS,
  watchCrashFrom: 'start',
  onCrash: handleCoreCrash,
});

export { chronokiCore };
