/* @layer bridge-wasm @kind logic */
import { readMsuResume } from '@drizztdourden08/brock-msu/packs';
import type { SaveSlotRef } from '@drizztdourden08/brock-port-kit';
import { appLog } from '@app/log/app-log';
import { platformFiles } from '@app/storage/platform-files';
import { isMsuSessionActive, msuRestore } from '../msu-session';
import { resumeSlotOf } from './resume-slot-of';
import { ctMsuConfig } from '@chronoki/game-core';

const restoreMusicPosition = async (profileId: string, ref: SaveSlotRef): Promise<void> => {
  if (!isMsuSessionActive()) return;
  try {
    const state = await readMsuResume(ctMsuConfig, platformFiles(), resumeSlotOf(profileId, ref));
    if (state) msuRestore(state);
  } catch (err) {
    appLog.warn('[MSU] Could not restore the music position', err);
  }
};

export { restoreMusicPosition };
