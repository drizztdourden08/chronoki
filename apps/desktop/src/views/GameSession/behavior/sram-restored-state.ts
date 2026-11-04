/* @layer renderer-appshell @kind logic */
import { bytesEqual } from './bytes-equal';

const sramRestoredState = (original: Uint8Array | null, final: Uint8Array | null, stored: Uint8Array | null): boolean | 'removed' => {
  if (original) return bytesEqual(final, stored);
  return final === null ? 'removed' : false;
};

export { sramRestoredState };
