/* @layer renderer-components @kind logic */
import type { CheckDef } from '@chronoki/game-core';
import { resolveMysteryOptions } from '@chronoki/game-core';
import { checksOfPack } from '@app/game/randomizer/checks-of-pack';
import { packOfRom } from '@app/game/randomizer/pack-of-rom';
import { randomizerConfigOf } from '@app/game/randomizer/randomizer-config-of';

const seedChecksOfProfile = async (profileId: string, romFile: string): Promise<readonly CheckDef[]> => {
  const config = randomizerConfigOf(profileId);
  if (config === undefined) return [];
  return checksOfPack(await packOfRom(romFile), resolveMysteryOptions(config.options, config.seed));
};

export { seedChecksOfProfile };
