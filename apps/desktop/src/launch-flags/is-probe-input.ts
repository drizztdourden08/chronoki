/* @layer renderer-lib @kind logic */
import { startupFlag } from './startup-flag';

const isProbeInput = (): boolean => startupFlag('probe-input') !== undefined;

export { isProbeInput };
