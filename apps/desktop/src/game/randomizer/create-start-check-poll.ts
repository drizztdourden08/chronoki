/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import type { createOptionsStartCheck } from '@chronoki/game-core';
import { appRandomizerLog } from '@drizztdourden08/brock-randomizer/session';
import { START_CHECK_MAX_POLLS } from './chronoki-poll-hooks.constants';
import type { StartCheckPoll } from './start-check-poll.type';

const createStartCheckPoll = (check: ReturnType<typeof createOptionsStartCheck>): StartCheckPoll => {
  let logged = false;
  let polls = 0;
  return {
    poll: (view: MemoryView, started: boolean): void => {
      if (!started || logged || check === null) return;
      polls += 1;
      if (!check.settled(view) && polls < START_CHECK_MAX_POLLS) return;
      logged = true;
      appRandomizerLog(check.read(view));
    },
    reset: (): void => {
      logged = false;
      polls = 0;
    },
  };
};

export { createStartCheckPoll };
