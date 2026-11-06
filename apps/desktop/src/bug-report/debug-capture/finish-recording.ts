/* @layer renderer-lib @kind logic */
import { toolsApi } from '@drizztdourden08/brock-tools/renderer';
import { requireAppApi } from '@app/ipc/require-app-api';
import type { DebugCaptureScreenshot, DebugCaptureSnapshot } from '@app/debug-report';

const finishRecording = async (
  profileId: string, sessionKey: string, snapshots: DebugCaptureSnapshot[], screenshots: DebugCaptureScreenshot[],
): Promise<void> => {
  const frames = screenshots.map(({ capturedAt, png }) => ({ capturedAt, png }));
  const result = await toolsApi()?.finalizeRecording({ scope: profileId, key: sessionKey, frames, samples: snapshots });
  if (result?.success) await requireAppApi().finalizeDebugCaptureSession({ profileId, sessionKey });
};

export { finishRecording };
