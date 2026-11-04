/* @layer renderer-lib @kind logic */
import { startupFlag } from './startup-flag';

const isProbeHost = (): boolean => startupFlag('probe-host') === true;

export { isProbeHost };
