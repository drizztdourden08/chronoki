/* @layer bridge-wasm @kind logic */
import { isMsuSessionActive, msuSnapshot } from '@drizztdourden08/brock-msu/session';
import { appLog } from '@app/log/app-log';
import { msuRuntime } from '../msu-session/msu-runtime';
import { resumeMsuAfterReboot } from '../msu-session/resume-msu-after-reboot';
import { pushLiveSettings } from '../live-settings/push-live-settings';
import { captureEngineState } from '../save-states/capture-engine-state';
import { stateLoadedSignal } from '../save-states/state-loaded-signal';
import { applyLiveVolume } from '../turbo/apply-live-volume';
import { activeGameHolder } from './active-game-holder';
import { chronokiCore } from './chronoki-core';
import { haltGame } from './halt-game';
import { rebootInto } from './reboot-into';
import type { ReplanOutcome, ReplanRequest } from './replan-game.type';
import { replanStore } from './replan-store';

const replanGame = async ({ from, to, volume }: ReplanRequest): Promise<ReplanOutcome> => {
  const game = activeGameHolder.current;
  if (!game) return { kind: 'lost' };
  const captured = await captureEngineState({ core: chronokiCore });
  if (!captured.ok) return { kind: 'deferred' };
  replanStore.set(true);
  try {
    const music = isMsuSessionActive() ? msuSnapshot() : null;
    const packName = msuRuntime.packName;
    await haltGame(game);
    const outcome = await rebootInto(game, { from, to }, captured.state);
    replanStore.set(false);
    if (outcome.kind === 'lost' || outcome.kind === 'deferred') return outcome;
    applyLiveVolume(volume);
    pushLiveSettings();
    await resumeMsuAfterReboot(packName, outcome.kind === 'rescued' ? null : music);
    if (outcome.kind !== 'rescued') stateLoadedSignal.emit();
    activeGameHolder.current?.canvas.focus();
    appLog.info(`[replan] ${outcome.kind}: ${from.settings.wideWidth}x${from.settings.tallLines} to ${outcome.plan.settings.wideWidth}x${outcome.plan.settings.tallLines}`);
    return outcome;
  } finally {
    replanStore.set(false);
  }
};

export { replanGame };
