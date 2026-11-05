/* @layer bridge-wasm @kind logic */
import { appRandomizerLog } from '@drizztdourden08/brock-randomizer/renderer';
import { chronokiRawMemoryBridge } from './chronoki-raw-memory-bridge';
import { NO_COMPLETED, SAVE_LOAD_LOG } from './chronoki-poll-hooks.constants';
import { gameLoadedSignal } from './game-loaded-signal';
import { gameStartGate } from './game-start-gate';
import { localRunHolder } from './local-run-holder';

const chronokiPollHooks = {
  completed: (): ReadonlySet<string> => localRunHolder.run?.gifts.completed() ?? NO_COMPLETED,
  beforePoll: (): void => {
    const run = localRunHolder.run;
    const view = chronokiRawMemoryBridge.view();
    if (view === null || run === null) return;
    const started = gameStartGate.observe(view);
    run.start.observe(view, started, gameStartGate.newGame());
    if (!started) return;
    if (run.saveLoad.loaded(view)) {
      appRandomizerLog(SAVE_LOAD_LOG);
      gameLoadedSignal.emit();
    }
    run.gifts.observe(view);
  },
};

export { chronokiPollHooks };
