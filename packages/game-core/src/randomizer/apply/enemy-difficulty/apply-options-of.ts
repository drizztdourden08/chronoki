/* @layer bridge-wasm @kind logic */
import type { ItemDifficulty } from '../../world/treasure-tiers/treasure-tier.type';
import type { ApplyOptions } from '../apply-seed.type';
import type { TechOrderMode } from '../tech-order/tech-order.type';
import { bossDepthsOf } from './boss-depths-of';
import type { OptionBag, SphereLike } from './enemy-difficulty.type';

const TECH_ORDER_MODES: readonly string[] = ['balanced-random', 'full-random'];

const applyOptionsOf = (options: OptionBag, spheres: readonly SphereLike[], seed = ''): ApplyOptions => ({
  difficulty: (options.itemDifficulty ?? 'normal') as ItemDifficulty,
  ...(options.enemyDifficulty === 'hard' ? { hardEnemies: true } : {}),
  ...(options.epochFail === true && options.gameMode !== 'lost-worlds' ? { epochFail: true } : {}),
  ...(options.bossScaling === true ? { bossDepths: bossDepthsOf(spheres) } : {}),
  ...(TECH_ORDER_MODES.includes(String(options.techOrder)) ? { techOrder: options.techOrder as TechOrderMode, seed } : {}),
});

export { applyOptionsOf };
