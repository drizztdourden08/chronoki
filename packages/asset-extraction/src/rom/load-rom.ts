/* @layer shared-asset-extraction @kind logic */
import { normalizeRom } from './normalize-rom';
import { verifyRom } from './verify-rom';

/** ctlib/rom.py load(path) on bytes already read: strip a copier header, then verify unless `check` is off. */
const loadRom = (fileBytes: Uint8Array, check = true): Uint8Array => {
  const data = normalizeRom(fileBytes);
  return check ? verifyRom(data) : data;
};

export { loadRom };
