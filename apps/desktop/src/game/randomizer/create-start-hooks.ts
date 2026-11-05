/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import type { CtOptionValues } from '@chronoki/game-core';
import {
  createCtWramWriter, createStartGoldGrant, createStartStateCheck, HARD_START_GOLD, modeOf, START_STATES,
} from '@chronoki/game-core';
import { appRandomizerLog } from '@drizztdourden08/brock-randomizer/session';
import { chronokiMemoryOptions } from './chronoki-memory-options';
import { chronokiRawMemoryBridge } from './chronoki-raw-memory-bridge';
import type { StartHooks } from './start-hooks.type';

const createStartHooks = (options: CtOptionValues): StartHooks => {
  const grant = options.itemDifficulty === 'hard'
    ? createStartGoldGrant(createCtWramWriter(chronokiMemoryOptions, chronokiRawMemoryBridge), HARD_START_GOLD)
    : null;
  const state = START_STATES[modeOf(options).startState];
  const check = state === undefined ? null : createStartStateCheck(state);
  let logged = false;
  return {
    observe: (view: MemoryView, started: boolean): void => {
      grant?.observe(started);
      if (!started || logged || check === null) return;
      logged = true;
      appRandomizerLog(check.read(view));
    },
    reset: (): void => {
      grant?.reset();
      logged = false;
    },
  };
};

export { createStartHooks };
