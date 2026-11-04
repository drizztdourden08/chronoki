/* @layer bridge-wasm @kind logic */
import { deleteMsuResume, writeMsuResume } from '@drizztdourden08/brock-msu/packs';
import type { SaveSlotRef } from '@drizztdourden08/brock-port-kit';
import { appLog } from '@app/log/app-log';
import { platformFiles } from '@app/storage/platform-files';
import { isMsuSessionActive, msuSnapshot } from '../msu-session';
import { resumeSlotOf } from './resume-slot-of';
import { sidecarConfig } from './sidecar-config';

const saveMusicPosition = async (profileId: string, ref: SaveSlotRef): Promise<void> => {
  if (!isMsuSessionActive()) return;
  const files = platformFiles();
  const slot = resumeSlotOf(profileId, ref);
  try {
    const state = msuSnapshot();
    if (state) await writeMsuResume({ config: sidecarConfig, files, slot, state });
    else await deleteMsuResume(sidecarConfig, files, slot);
  } catch (err) {
    appLog.warn('[MSU] Could not store the music position', err);
  }
};

export { saveMusicPosition };
