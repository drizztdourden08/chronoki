/* @layer renderer-lib @kind logic */
import { deleteRomFile } from '../rom-files';
import { platformFiles } from '../platform-files';
import { removeTitlePendulum } from '../title-pendulum';

const deleteRom = async (romFile: string): Promise<void> => {
  await deleteRomFile(platformFiles(), romFile);
  await removeTitlePendulum(platformFiles(), romFile).catch(() => undefined);
};

export { deleteRom };
