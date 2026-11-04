/* @layer renderer-lib @kind logic */
import { startupFlag } from './startup-flag';

const probeInputPresses = (): boolean => startupFlag('probe-input') !== 'none';

export { probeInputPresses };
