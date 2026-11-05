/* @layer bridge-wasm @kind logic */
import type { CheckDef } from '@chronoki/game-core';
import { checksOfPack } from './checks-of-pack';
import { packOfRom } from './pack-of-rom';

const checksOfRom = async (romFile: string): Promise<readonly CheckDef[]> => checksOfPack(await packOfRom(romFile));

export { checksOfRom };
