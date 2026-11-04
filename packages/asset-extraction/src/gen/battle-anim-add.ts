/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { recipeState } from '../oracle/peek-access';
import { ANIM_RECIPE } from './battle-anim/anim-consts.constants';
import { bakeGroup } from './battle-anim-add/add-bake';
import { CRONO_IDLE_KEYS, GATO_SWIPE_KEYS } from './battle-anim-add/add-bake.constants';
import { emitAdd } from './battle-anim-add/add-emit';
import { gatoIdleNoAttack } from './battle-anim-add/add-idle';
import type { GenFiles } from './oracle-gen-stage';

/** tools/gen/battle_anim_add.py: the Crono idle stream, GATO claw swipe and steady GATO idle as src/data/battle_anim_add.h. */
const genBattleAnimAdd = async (ctx: ImportContext): Promise<GenFiles> => {
  const state = await recipeState(ctx, ANIM_RECIPE);
  const cidle = await bakeGroup(ctx, state, CRONO_IDLE_KEYS);
  const gswipe = await bakeGroup(ctx, state, GATO_SWIPE_KEYS);
  const v2 = await gatoIdleNoAttack(ctx, state);
  return { 'battle_anim_add.h': emitAdd(cidle, gswipe, v2) };
};

export { genBattleAnimAdd };
