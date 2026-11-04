/* @layer bridge-wasm @kind logic */
import type { CheckDef } from '@chronoki/game-core';
import { loadAssets } from '@app/storage/assets-store';
import { NO_PACK_ROLL } from './chronoki-randomizer.constants';
import { checksOfPack } from './checks-of-pack';

const checksOfRom = async (romFile: string): Promise<readonly CheckDef[]> => {
  const buffer = await loadAssets(romFile);
  if (buffer === null) throw new Error(NO_PACK_ROLL);
  return checksOfPack(new Uint8Array(buffer));
};

export { checksOfRom };
