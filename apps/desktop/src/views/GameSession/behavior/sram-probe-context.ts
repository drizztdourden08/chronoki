/* @layer renderer-appshell @kind logic */
import { activeGameHolder, chronokiCore } from '@app/game/lifecycle';
import type { SramProbeContext } from './sram-probe.type';

const sramProbeContext = (): SramProbeContext | null => {
  const game = activeGameHolder.current;
  const fs = chronokiCore.fs();
  if (!game?.profileId || !fs) return null;
  return { fs, profileId: game.profileId, files: game.files, store: game.store };
};

export { sramProbeContext };
