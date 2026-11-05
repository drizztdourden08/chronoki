/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import type { CtOptionValues } from '@chronoki/game-core';
import {
  createCtWramWriter, createStartGoldGrant, createStartStateCheck, HARD_START_GOLD, modeOf, START_STATES,
} from '@chronoki/game-core';
import { appRandomizerLog } from '@drizztdourden08/brock-randomizer/session';
import { chronokiMemoryOptions } from './chronoki-memory-options';
import { chronokiRawMemoryBridge } from './chronoki-raw-memory-bridge';
import { START_CHECK_MAX_POLLS } from './chronoki-poll-hooks.constants';
import type { StartHooks } from './start-hooks.type';

const createStartHooks = (options: CtOptionValues): StartHooks => {
  const grant = options.itemDifficulty === 'hard'
    ? createStartGoldGrant(createCtWramWriter(chronokiMemoryOptions, chronokiRawMemoryBridge), HARD_START_GOLD)
    : null;
  const state = START_STATES[modeOf(options).startState];
  const check = state === undefined ? null : createStartStateCheck(state);
  let logged = false;
  let polls = 0;
  return {
    observe: (view: MemoryView, started: boolean, newGame: boolean): void => {
      grant?.observe(started && newGame);
      if (!started || logged || check === null) return;
      polls += 1;
      if (!check.settled(view) && polls < START_CHECK_MAX_POLLS) return;
      logged = true;
      appRandomizerLog(check.read(view));
    },
    reset: (): void => {
      grant?.reset();
      logged = false;
      polls = 0;
    },
  };
};

export { createStartHooks };
