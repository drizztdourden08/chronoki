/* @layer shared-asset-extraction @kind logic */
import { normalizeRom } from './normalize-rom';
import { verifyRom } from './verify-rom';

const loadRom = (fileBytes: Uint8Array, check = true): Uint8Array => {
  const data = normalizeRom(fileBytes);
  return check ? verifyRom(data) : data;
};

export { loadRom };
