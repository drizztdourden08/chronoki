/* @layer electron-main @kind logic */
import { copyFile } from 'fs/promises';
import { join } from 'path';
import { frameName, pickEvenlySpread, budgetedFrameCount } from '../capture-frame-budget';
import { PACKAGED_BUDGET_BYTES } from './finalize-capture-session.constants';

const buildPackagedFrames = async (
  packagedDir: string, dir: string, totalBytes: number, frameNames: string[],
): Promise<void> => {
  const targetCount = budgetedFrameCount(totalBytes, frameNames.length, PACKAGED_BUDGET_BYTES);
  const selected = pickEvenlySpread(frameNames, targetCount);
  await Promise.all(selected.map((name, i) => copyFile(join(dir, name), join(packagedDir, frameName(i)))));
};

export { buildPackagedFrames };
