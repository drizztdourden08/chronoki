/* @layer bridge-wasm @kind logic */
import { msuRestore } from '@drizztdourden08/brock-msu/session';
import type { msuSnapshot } from '@drizztdourden08/brock-msu/session';
import { msuRuntime } from './msu-runtime';
import { startCtMsuSession } from './start-ct-msu-session';

const resumeMsuAfterReboot = async (packName: string | null, music: ReturnType<typeof msuSnapshot>): Promise<void> => {
  if (!packName) return;
  const started = await startCtMsuSession(packName);
  if (!started || !music) return;
  msuRuntime.bridge?.poll();
  msuRestore(music);
};

export { resumeMsuAfterReboot };
