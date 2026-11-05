/* @layer bridge-wasm @kind logic */
import type { RandomizerProfileConfig, RollContext } from '@drizztdourden08/brock-randomizer';
import type { CtPlacement } from '@chronoki/game-core';
import { deriveSealedCheckIds, rollCtPlacement } from '@chronoki/game-core';
import { NO_CHECKS_ROLL, NO_PACK_ROLL } from './chronoki-randomizer.constants';
import { checksOfPack } from './checks-of-pack';
import { packOfRom } from './pack-of-rom';
import { romFileOfRoll } from './rom-file-of-roll';

const rollChronokiSeed = async (config: RandomizerProfileConfig, ctx: RollContext): Promise<CtPlacement> => {
  const romFile = romFileOfRoll(ctx);
  if (romFile === undefined) throw new Error(NO_PACK_ROLL);
  const pack = await packOfRom(romFile);
  const checks = checksOfPack(pack);
  if (checks.length === 0) throw new Error(NO_CHECKS_ROLL);
  return rollCtPlacement({ checks, sealedCheckIds: deriveSealedCheckIds(pack), options: config.options }, config.seed);
};

export { rollChronokiSeed };
