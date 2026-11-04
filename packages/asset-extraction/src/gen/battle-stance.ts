/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { peekOracle, recipeState } from '../oracle/peek-access';
import { emitStance } from './battle-stance-emit';
import { BTN } from './battle-stance-emit.constants';
import type { GenFiles } from './oracle-gen-stage.type';
import { decodeOam, oamBlob, oamCgram } from './shared/oam-decode';
import { BRACKET_TILE } from './battle-stance.constants';

const genBattleStance = async (ctx: ImportContext): Promise<GenFiles> => {
  const state = await recipeState(ctx, 'battle_gato_press_action');
  const dump = await peekOracle(ctx).peek({ state, script: BTN });
  const cgram = oamCgram(dump.oam);
  if (!cgram) throw new Error('the peek .oam sidecar carries no CGRAM');
  const on = decodeOam(oamBlob(dump.oam))
    .filter((s) => s.y < 200 && s.x > -32 && s.x < 256 && [1, 5, 6].includes(s.pal) && s.tile !== BRACKET_TILE)
    .sort((a, b) => a.idx - b.idx);
  return { 'battle_stance.h': emitStance(on, dump.vram, cgram) };
};

export { genBattleStance };
