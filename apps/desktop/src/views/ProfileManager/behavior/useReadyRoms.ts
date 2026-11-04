/* @layer renderer-components @kind hook */
import { useEffect, useState } from 'react';
import { listRomsWithStatus } from '@app/storage/roms-store';
import type { ReadyRom } from '../ProfileManager.type';

const readReadyRoms = async (): Promise<ReadyRom[]> =>
  (await listRomsWithStatus()).filter((rom) => rom.hasAssets).map(({ romFile, label }) => ({ romFile, label }));

const useReadyRoms = (): ReadyRom[] => {
  const [roms, setRoms] = useState<ReadyRom[]>([]);

  useEffect(() => {
    let current = true;
    void readReadyRoms().then((loaded) => { if (current) setRoms(loaded); });
    return () => { current = false; };
  }, []);

  return roms;
};

export { useReadyRoms };
