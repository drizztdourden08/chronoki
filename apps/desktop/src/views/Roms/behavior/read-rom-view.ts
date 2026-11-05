/* @layer renderer-components @kind logic */
import { ROMS_DIR } from '@drizztdourden08/brock-port-kit';
import { platformFiles } from '@app/storage/platform-files';
import { readRomDetail } from '@app/storage/roms-store';
import type { RomDetailView } from '../Roms.type';

const readRomView = async (romFile: string): Promise<RomDetailView | null> => {
  const info = await readRomDetail(romFile);
  if (!info) return null;
  const stat = await platformFiles().stat(`${ROMS_DIR}/${romFile}`);
  const stamp = stat ? new Date(stat.mtimeMs).toISOString() : null;
  return { ...info, name: romFile, size: info.size ?? stat?.bytes ?? null, created: stamp, modified: stamp };
};

export { readRomView };
