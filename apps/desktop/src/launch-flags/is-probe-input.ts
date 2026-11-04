/* @layer renderer-lib @kind logic */
import { startupFlag } from './startup-flag';

const isProbeInput = (): boolean => startupFlag('probe-input') !== undefined;

const probeInputPresses = (): boolean => startupFlag('probe-input') !== 'none';

export { isProbeInput, probeInputPresses };
