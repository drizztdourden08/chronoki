/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { peekOracle, recipeState } from '../oracle/peek-access';
import { collect } from './battle-anim/anim-collect';
import { ANIM_RECIPE } from './battle-anim/anim-consts';
import { emitBattleAnim } from './battle-anim/anim-emit';
import { monitorRequest, parseMonitor, scriptFor } from './battle-anim/anim-sprites';
import { cronoAttackTable, cronoBobTable, gatoIdleTable } from './battle-anim/anim-tables';
import type { GenFiles } from './oracle-gen-stage.type';

const genBattleAnim = async (ctx: ImportContext): Promise<GenFiles> => {
  const state = await recipeState(ctx, ANIM_RECIPE);
  const collected = await collect(ctx, state);
  const oracle = peekOracle(ctx);
  const mash = parseMonitor(await oracle.monitor(monitorRequest(state, scriptFor('mash', 533))));
  const hold = parseMonitor(await oracle.monitor(monitorRequest(state, scriptFor('hold', 507))));
  return {
    'battle_anim.h': emitBattleAnim(collected, cronoAttackTable(mash), cronoBobTable(hold), gatoIdleTable(hold)),
  };
};

export { genBattleAnim };
