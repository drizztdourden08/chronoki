/* @layer bridge-wasm @kind logic */
import type { ArchipelagoGame } from '@drizztdourden08/brock-randomizer';
import { apCall, apCallsOrNull, apNumber } from './chronoki-ap-calls';
import {
  AP_DEATH_CAUSE, AP_DEATH_POLL_MS, AP_KILL_LANDING_NEXT_BATTLE_FRAME, CK_AP_KILL_PARTY, CK_SET_AP_DEATH_LINK, CK_SET_AP_KILL_LANDING,
} from './chronoki-ap-death-link.constants';
import { takeApDeaths } from './take-ap-deaths';

type ChronokiDeathLink = NonNullable<ArchipelagoGame<unknown, unknown>['deathLink']>;

const listeners = new Set<(cause: string) => void>();
let timer: ReturnType<typeof setInterval> | null = null;

const tick = (): void => {
  if (takeApDeaths() === 0) return;
  listeners.forEach((listener) => listener(AP_DEATH_CAUSE));
};

const stopTimer = (): void => {
  if (timer !== null) clearInterval(timer);
  timer = null;
};

const chronokiApDeathLink: ChronokiDeathLink = {
  onDied: (f) => {
    listeners.add(f);
    timer ??= setInterval(tick, AP_DEATH_POLL_MS);
    return () => {
      listeners.delete(f);
      if (listeners.size === 0) stopTimer();
    };
  },
  kill: () => {
    const calls = apCallsOrNull();
    if (calls === null || !calls.has(CK_AP_KILL_PARTY)) return 'unsupported';
    apCall(CK_SET_AP_KILL_LANDING, AP_KILL_LANDING_NEXT_BATTLE_FRAME);
    return (apNumber(CK_AP_KILL_PARTY) ?? 0) === 0 ? 'down' : 'armed';
  },
  setEnabled: (on) => {
    apCall(CK_SET_AP_DEATH_LINK, on ? 1 : 0);
  },
};

export { chronokiApDeathLink };
