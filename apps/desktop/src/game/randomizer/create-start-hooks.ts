/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import type { CtOptionValues, CtStartParty } from '@chronoki/game-core';
import {
  createCtWramWriter, createModeHooks, createStartGoldGrant, createStartMagicGrant, createOptionsStartCheck, HARD_START_GOLD, LEGACY_PARTY,
} from '@chronoki/game-core';
import { appRandomizerLog } from '@drizztdourden08/brock-randomizer/session';
import { chronokiMemoryOptions } from './chronoki-memory-options';
import { chronokiRawMemoryBridge } from './chronoki-raw-memory-bridge';
import { GOAL_REACHED_LOG } from './chronoki-poll-hooks.constants';
import { createStartCheckPoll } from './create-start-check-poll';
import type { StartHooks } from './start-hooks.type';

const createStartHooks = (options: CtOptionValues, party: CtStartParty = LEGACY_PARTY, seed?: string): StartHooks => {
  const grant = options.itemDifficulty === 'hard'
    ? createStartGoldGrant(createCtWramWriter(chronokiMemoryOptions, chronokiRawMemoryBridge), HARD_START_GOLD)
    : null;
  const magic = options.unlockedMagic === true
    ? createStartMagicGrant(createCtWramWriter(chronokiMemoryOptions, chronokiRawMemoryBridge))
    : null;
  const mode = createModeHooks(options, createCtWramWriter(chronokiMemoryOptions, chronokiRawMemoryBridge), {
    seed, party, log: appRandomizerLog,
  });
  const checkPoll = createStartCheckPoll(createOptionsStartCheck(options, party));
  let goalLogged = false;
  return {
    observe: (view: MemoryView, started: boolean, newGame: boolean): void => {
      grant?.observe(started && newGame, view);
      magic?.observe(started && newGame, view);
      mode.observe(view, started, newGame);
      if (!goalLogged && mode.goalReached()) {
        goalLogged = true;
        appRandomizerLog(GOAL_REACHED_LOG);
      }
      checkPoll.poll(view, started);
    },
    goalReached: (): boolean => mode.goalReached(),
    reset: (): void => {
      grant?.reset();
      magic?.reset();
      mode.reset();
      checkPoll.reset();
      goalLogged = false;
    },
  };
};

export { createStartHooks };
