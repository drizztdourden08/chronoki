/* @layer renderer-app @kind hook */
import { useEffect, useState } from 'react';
import { onSteamDataChanged } from '@app/storage/steam-store/on-steam-data-changed';
import { refreshSteamFlag } from '@app/storage/steam-store/refresh-steam-flag';
import { steamDataImportedNow } from '@app/storage/steam-store/steam-data-imported-now';

const useSteamDataImported = (): boolean => {
  const [imported, setImported] = useState(steamDataImportedNow);
  useEffect(() => {
    const sync = (): void => {
      void refreshSteamFlag().then(setImported);
    };
    sync();
    window.addEventListener('focus', sync);
    const off = onSteamDataChanged(sync);
    return () => {
      window.removeEventListener('focus', sync);
      off();
    };
  }, []);
  return imported;
};

export { useSteamDataImported };
