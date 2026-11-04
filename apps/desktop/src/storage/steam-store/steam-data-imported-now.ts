/* @layer renderer-lib @kind logic */
import { steamFlagHolder } from './steam-flag-holder';

const steamDataImportedNow = (): boolean => steamFlagHolder.imported;

export { steamDataImportedNow };
