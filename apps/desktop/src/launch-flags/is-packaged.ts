/* @layer renderer-lib @kind logic */
import { startupFlag } from './startup-flag';

const isPackaged = (): boolean => startupFlag('packaged') === true;

export { isPackaged };
