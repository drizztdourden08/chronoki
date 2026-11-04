/* @layer bridge-wasm @kind logic */
import { loadAssets } from '@app/storage/assets-store';
import { ctChecksCache } from './ct-checks-cache';

const primeChecksFromRom = async (romFile: string): Promise<boolean> => {
  const buffer = await loadAssets(romFile);
  if (buffer === null) return false;
  ctChecksCache.prime(new Uint8Array(buffer));
  return true;
};

export { primeChecksFromRom };
