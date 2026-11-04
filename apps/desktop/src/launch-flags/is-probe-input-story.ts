/* @layer renderer-lib @kind logic */
import { startupFlag } from './startup-flag';

const isProbeInputStory = (): boolean => startupFlag('probe-input') === 'story';

export { isProbeInputStory };
