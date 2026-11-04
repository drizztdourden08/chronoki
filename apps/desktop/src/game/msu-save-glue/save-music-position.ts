/* @layer bridge-wasm @kind logic */
import { writeMsuResume } from '@drizztdourden08/brock-msu/packs';
import type { SaveSlotRef } from '@drizztdourden08/brock-port-kit';
import { appLog } from '@app/log/app-log';
import { platformFiles } from '@app/storage/platform-files';
import { isMsuSessionActive, msuSnapshot } from '../msu-session';
import { resumeSlotOf } from './resume-slot-of';
import { ctMsuConfig } from '@chronoki/game-core';

const saveMusicPosition = async (profileId: string, ref: SaveSlotRef): Promise<void> => {
  if (!isMsuSessionActive()) return;
  const state = msuSnapshot();
  if (!state) return;
  try {
    await writeMsuResume({ config: ctMsuConfig, files: platformFiles(), slot: resumeSlotOf(profileId, ref), state });
  } catch (err) {
    appLog.warn('[MSU] Could not store the music position', err);
  }
};

export { saveMusicPosition };
