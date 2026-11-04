/* @layer shared-asset-extraction @kind logic */
import { createBlobWriter } from './blob-writer';

const concatBytes = (parts: readonly ArrayLike<number>[]): Uint8Array => {
  const w = createBlobWriter();
  for (const p of parts) w.bytes(p);
  return w.toBytes();
};

export { concatBytes };
