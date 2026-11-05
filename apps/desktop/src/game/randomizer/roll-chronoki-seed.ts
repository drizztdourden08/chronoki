/* @layer bridge-wasm @kind logic */
import type { RandomizerProfileConfig, RollContext, RollOutcome } from '@drizztdourden08/brock-randomizer';
import type { CtPlacement } from '@chronoki/game-core';
import { realWorldInputOfPack, resolveMysteryOptions, rollCtPlacement, withCtOptionDefaults } from '@chronoki/game-core';
import { rollChronokiArchipelia } from './archipelago/chronoki-roll-archipelia';
import { NO_CHECKS_ROLL, NO_PACK_ROLL } from './chronoki-randomizer.constants';
import { packOfRom } from './pack-of-rom';
import { romFileOfRoll } from './rom-file-of-roll';

const rollChronokiSeed = async (config: RandomizerProfileConfig, ctx: RollContext): Promise<RollOutcome<CtPlacement>> => {
  if (ctx.mode === 'archipelia') return rollChronokiArchipelia(config, ctx);
  const romFile = romFileOfRoll(ctx);
  if (romFile === undefined) throw new Error(NO_PACK_ROLL);
  const pack = await packOfRom(romFile);
  const input = realWorldInputOfPack(pack, resolveMysteryOptions(withCtOptionDefaults(config.options), config.seed));
  if (input.checks.length === 0) throw new Error(NO_CHECKS_ROLL);
  return rollCtPlacement(input, config.seed);
};

export { rollChronokiSeed };
