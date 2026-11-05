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
    const load = () => { void readReadyRoms().then((loaded) => { if (current) setRoms(loaded); }); };
    const onVisible = () => { if (document.visibilityState === 'visible') load(); };
    load();
    window.addEventListener('focus', load);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      current = false;
      window.removeEventListener('focus', load);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return roms;
};

export { useReadyRoms };
