/* @layer renderer-lib @kind logic */
import { platformFiles } from '@app/storage/platform-files';
import { capturePathOf } from './capture-path';
import type { CaptureSession } from './debug-capture.type';

const readCaptureSession = async (profileId: string, sessionKey: string): Promise<CaptureSession | null> => {
  try {
    const text = await platformFiles().readText(capturePathOf(profileId, sessionKey));
    return text ? (JSON.parse(text) as CaptureSession) : null;
  } catch {
    return null;
  }
};

export { readCaptureSession };
