/* @layer renderer-lib @kind logic */
import type { CaptureRun } from './debug-capture.type';

const captureRun: { current: CaptureRun | null } = { current: null };

export { captureRun };
