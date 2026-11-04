/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { peekOracle, recipeState } from '../oracle/peek-access';
import { collect } from './battle-anim/anim-collect';
import { ANIM_RECIPE } from './battle-anim/anim-consts.constants';
import { emitBattleAnim } from './battle-anim/anim-emit';
import { parseMonitor } from './battle-anim/parse-monitor';
import { monitorRequest } from './battle-anim/monitor-request';
import { scriptFor } from './battle-anim/script-for';
import { gatoIdleTable } from './battle-anim/gato-idle-table';
import { cronoBobTable } from './battle-anim/crono-bob-table';
import { cronoAttackTable } from './battle-anim/crono-attack-table';
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
