/* @layer renderer-appshell @kind logic */
import type { Profile } from '@drizztdourden08/brock-core';
import { listRomsWithStatus } from '@app/storage/roms-store';
import type { GameLaunch } from '../GameSession.type';

const profileRomOf = (profile: Profile): string | null => {
  const romFile: unknown = Reflect.get(profile, 'romFile');
  return typeof romFile === 'string' && romFile !== '' ? romFile : null;
};

const resolveLaunch = async (profile: Profile, id: number): Promise<GameLaunch | null> => {
  const ready = (await listRomsWithStatus()).filter((rom) => rom.hasAssets);
  const wanted = profileRomOf(profile);
  const rom = ready.find((candidate) => candidate.romFile === wanted) ?? ready[0];
  return rom ? { id, profileId: profile.id, romFile: rom.romFile } : null;
};

export { resolveLaunch };
