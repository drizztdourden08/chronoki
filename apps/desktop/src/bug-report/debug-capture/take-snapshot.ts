/* @layer renderer-lib @kind logic */
import type { DebugCaptureSnapshot } from '@app/debug-report';

const takeSnapshot = (session: number): DebugCaptureSnapshot => ({ session, capturedAt: Date.now() });

export { takeSnapshot };
