/* @layer renderer-appshell @kind logic */
import { loadState, saveState } from '@app/game/save-states';
import type { StateResult } from '@app/game/save-states';
import { STATE_PROBE_FRAMES, STATE_PROBE_SLOT } from '../GameSession.constants';
import { logProbe } from './log-probe';
import { outcomeOf } from './outcome-of';
import { stateContext } from './state-context';
import { waitForFrames } from './wait-for-frames';

const runStateProbe = async (): Promise<void> => {
  await waitForFrames(STATE_PROBE_FRAMES);
  const ctx = stateContext();
  const saved: StateResult = ctx ? await saveState(ctx, STATE_PROBE_SLOT) : { ok: false, reason: 'not-running' };
  const loaded = ctx && saved.ok ? await loadState(ctx, { kind: 'quick', slot: STATE_PROBE_SLOT }) : null;
  await logProbe({ probe: 'state', save: outcomeOf(saved), load: outcomeOf(loaded) });
};

export { runStateProbe };
