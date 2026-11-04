/* @layer renderer-lib @kind logic */
import { startupFlag } from './startup-flag';

const isProbeState = (): boolean => startupFlag('probe-state') === true;

export { isProbeState };
