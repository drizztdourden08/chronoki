/* @layer renderer-components @kind logic */
import { listRomsWithStatus } from '@app/storage/roms-store';

const pendulumRomOf = async (wanted: string | null): Promise<string | null> => {
  const ready = (await listRomsWithStatus()).filter((rom) => rom.hasAssets);
  return (ready.find((rom) => rom.romFile === wanted) ?? ready[0])?.romFile ?? null;
};

export { pendulumRomOf };
