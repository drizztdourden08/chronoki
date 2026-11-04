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
    return onSteamDataChanged(sync);
  }, []);
  return imported;
};

export { useSteamDataImported };
