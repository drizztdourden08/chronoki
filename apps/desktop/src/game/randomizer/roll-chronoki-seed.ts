/* @layer bridge-wasm @kind logic */
import type { RandomizerProfileConfig, RollContext } from '@drizztdourden08/brock-randomizer';
import type { CtPlacement } from '@chronoki/game-core';
import { rollCtPlacement } from '@chronoki/game-core';
import { NO_CHECKS_ROLL, NO_PACK_ROLL } from './chronoki-randomizer.constants';
import { checksOfRom } from './checks-of-rom';
import { romFileOfRoll } from './rom-file-of-roll';

const rollChronokiSeed = async (config: RandomizerProfileConfig, ctx: RollContext): Promise<CtPlacement> => {
  const romFile = romFileOfRoll(ctx);
  if (romFile === undefined) throw new Error(NO_PACK_ROLL);
  const checks = await checksOfRom(romFile);
  if (checks.length === 0) throw new Error(NO_CHECKS_ROLL);
  return rollCtPlacement({ checks, options: config.options }, config.seed);
};

export { rollChronokiSeed };
