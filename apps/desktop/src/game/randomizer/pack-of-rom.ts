/* @layer bridge-wasm @kind logic */
import { loadAssets } from '@app/storage/assets-store';
import { NO_PACK_ROLL } from './chronoki-randomizer.constants';

const packOfRom = async (romFile: string): Promise<Uint8Array> => {
  const buffer = await loadAssets(romFile);
  if (buffer === null) throw new Error(NO_PACK_ROLL);
  return new Uint8Array(buffer);
};

export { packOfRom };
