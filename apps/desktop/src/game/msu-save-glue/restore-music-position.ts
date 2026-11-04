/* @layer bridge-wasm @kind logic */
import { readMsuResume } from '@drizztdourden08/brock-msu/packs';
import type { SaveSlotRef } from '@drizztdourden08/brock-port-kit';
import { appLog } from '@app/log/app-log';
import { platformFiles } from '@app/storage/platform-files';
import { isMsuSessionActive, msuRestore } from '../msu-session';
import { restoreInFlight } from './restore-in-flight.state';
import { resumeSlotOf } from './resume-slot-of';
import { ctMsuConfig } from '@chronoki/game-core';

const restoreMusicPosition = async (profileId: string, ref: SaveSlotRef): Promise<void> => {
  if (!isMsuSessionActive()) return;
  const slot = resumeSlotOf(profileId, ref);
  const key = `${slot.profile}/${slot.slotKind}/${slot.slotId}`;
  if (restoreInFlight.has(key)) return;
  restoreInFlight.add(key);
  try {
    const state = await readMsuResume(ctMsuConfig, platformFiles(), slot);
    if (state) msuRestore(state);
  } catch (err) {
    appLog.warn('[MSU] Could not restore the music position', err);
  } finally {
    restoreInFlight.delete(key);
  }
};

export { restoreMusicPosition };
