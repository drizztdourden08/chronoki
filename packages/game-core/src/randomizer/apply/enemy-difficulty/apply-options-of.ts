/* @layer bridge-wasm @kind logic */
import type { ItemDifficulty } from '../../world/treasure-tiers/treasure-tier.type';
import type { ApplyOptions } from '../apply-seed.type';
import { bossDepthsOf } from './boss-depths-of';
import type { OptionBag, SphereLike } from './enemy-difficulty.type';

const applyOptionsOf = (options: OptionBag, spheres: readonly SphereLike[]): ApplyOptions => ({
  difficulty: (options.itemDifficulty ?? 'normal') as ItemDifficulty,
  ...(options.enemyDifficulty === 'hard' ? { hardEnemies: true } : {}),
  ...(options.epochFail === true && options.gameMode !== 'lost-worlds' ? { epochFail: true } : {}),
  ...(options.bossScaling === true ? { bossDepths: bossDepthsOf(spheres) } : {}),
});

export { applyOptionsOf };
