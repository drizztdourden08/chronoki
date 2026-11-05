/* @layer electron-main @kind logic */
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import type { DebugCaptureFinalizeInput, DebugCaptureFinalizeResult } from '@app/debug-report';
import { frameName } from '../capture-frame-budget';
import { buildPackagedFrames } from './build-packaged-frames';
import { captureSessionDir } from './capture-session-dir';
import { PACKAGED_SUBDIR } from './finalize-capture-session.constants';

const finalizeCaptureSession = async (input: DebugCaptureFinalizeInput): Promise<DebugCaptureFinalizeResult> => {
  const { profileId, sessionKey, snapshots, screenshots } = input;
  try {
    const dir = captureSessionDir(profileId, sessionKey);
    const packagedDir = join(dir, PACKAGED_SUBDIR);
    await mkdir(packagedDir, { recursive: true });
    await writeFile(join(dir, 'snapshots.jsonl'), snapshots.map((s) => JSON.stringify(s)).join('\n'));

    const frameNames = screenshots.map((_, i) => frameName(i));
    await Promise.all(screenshots.map((shot, i) => writeFile(join(dir, frameName(i)), Buffer.from(shot.png))));
    if (frameNames.length === 0) return { ok: true };

    await buildPackagedFrames(packagedDir, dir, screenshots, frameNames);
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
};

export { finalizeCaptureSession };
