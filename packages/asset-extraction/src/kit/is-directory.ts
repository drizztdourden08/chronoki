/* @layer shared-asset-extraction @kind logic */
import { stat } from 'node:fs/promises';

const isDirectory = (path: string): Promise<boolean> =>
  stat(path).then(
    (s) => s.isDirectory(),
    () => false,
  );

export { isDirectory };
