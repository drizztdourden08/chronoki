/* @layer bridge-wasm @kind logic */
import { createRng } from '@drizztdourden08/brock-randomizer/world';
import { BOSS_RANDO_STREAM } from './boss-rando.constants';
import type { BossAssignment } from './boss-rando.type';
import { BOSS_RANDO_SPOTS } from './boss-spots.constants';

const rollBossAssignment = (seed: string): BossAssignment => {
  const ids = BOSS_RANDO_SPOTS.map((spot) => spot.id);
  const shuffled = createRng(`${seed}${BOSS_RANDO_STREAM}`).shuffle(ids);
  return Object.fromEntries(ids.map((id, i) => [id, shuffled[i] ?? id]));
};

export { rollBossAssignment };
