/* @layer renderer-app @kind logic */
import { steamDataImportedNow } from '@app/storage/steam-store/steam-data-imported-now';

const steamSatisfied = (imported: boolean = steamDataImportedNow()): Set<string> => new Set(imported ? ['steamData'] : []);

export { steamSatisfied };
