/* @layer renderer-lib @kind logic */
import { startupFlag } from './startup-flag';

const isScreenshotRequested = (): boolean => startupFlag('screenshot') !== undefined;

export { isScreenshotRequested };
