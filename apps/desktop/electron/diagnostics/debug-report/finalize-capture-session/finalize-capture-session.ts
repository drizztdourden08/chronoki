/* @layer electron-main @kind logic */
import { mkdir, readdir, stat } from 'fs/promises';
import { join } from 'path';
import type { DebugCaptureFinalizeInput, DebugCaptureFinalizeResult } from '@app/debug-report';
import { buildPackagedFrames } from './build-packaged-frames';
import { captureSessionDir } from './capture-session-dir';
import { FRAME_FILE, PACKAGED_SUBDIR } from './finalize-capture-session.constants';

const finalizeCaptureSession = async (input: DebugCaptureFinalizeInput): Promise<DebugCaptureFinalizeResult> => {
  const { profileId, sessionKey } = input;
  try {
    const dir = captureSessionDir(profileId, sessionKey);
    const frameNames = (await readdir(dir)).filter((name) => FRAME_FILE.test(name)).sort();
    if (frameNames.length === 0) return { ok: true };

    const packagedDir = join(dir, PACKAGED_SUBDIR);
    await mkdir(packagedDir, { recursive: true });
    const sizes = await Promise.all(frameNames.map((name) => stat(join(dir, name)).then((s) => s.size)));
    await buildPackagedFrames(packagedDir, dir, sizes.reduce((sum, size) => sum + size, 0), frameNames);
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
};

export { finalizeCaptureSession };
