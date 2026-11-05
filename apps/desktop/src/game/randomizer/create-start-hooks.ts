/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import type { CtOptionValues, CtStartParty } from '@chronoki/game-core';
import {
  createCtWramWriter, createModeHooks, createStartGoldGrant, createStartMagicGrant, createOptionsStartCheck, HARD_START_GOLD, LEGACY_PARTY,
} from '@chronoki/game-core';
import { appRandomizerLog } from '@drizztdourden08/brock-randomizer/session';
import { chronokiMemoryOptions } from './chronoki-memory-options';
import { chronokiRawMemoryBridge } from './chronoki-raw-memory-bridge';
import { START_CHECK_MAX_POLLS } from './chronoki-poll-hooks.constants';
import type { StartHooks } from './start-hooks.type';

const createStartHooks = (options: CtOptionValues, party: CtStartParty = LEGACY_PARTY): StartHooks => {
  const grant = options.itemDifficulty === 'hard'
    ? createStartGoldGrant(createCtWramWriter(chronokiMemoryOptions, chronokiRawMemoryBridge), HARD_START_GOLD)
    : null;
  const magic = options.unlockedMagic === true
    ? createStartMagicGrant(createCtWramWriter(chronokiMemoryOptions, chronokiRawMemoryBridge))
    : null;
  const mode = createModeHooks(options, createCtWramWriter(chronokiMemoryOptions, chronokiRawMemoryBridge));
  const check = createOptionsStartCheck(options, party);
  let logged = false;
  let polls = 0;
  return {
    observe: (view: MemoryView, started: boolean, newGame: boolean): void => {
      grant?.observe(started && newGame, view);
      magic?.observe(started && newGame, view);
      mode.observe(view, started, newGame);
      if (!started || logged || check === null) return;
      polls += 1;
      if (!check.settled(view) && polls < START_CHECK_MAX_POLLS) return;
      logged = true;
      appRandomizerLog(check.read(view));
    },
    reset: (): void => {
      grant?.reset();
      magic?.reset();
      mode.reset();
      logged = false;
      polls = 0;
    },
  };
};

export { createStartHooks };
