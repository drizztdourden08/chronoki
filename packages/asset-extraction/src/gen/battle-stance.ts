/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { peekOracle, recipeState } from '../oracle/peek-access';
import { BTN, emitStance } from './battle-stance-emit';
import type { GenFiles } from './oracle-gen-stage';
import { decodeOam } from './shared/oam-decode';
import { oamCgram } from './shared/oam-cgram';
import { oamBlob } from './shared/oam-blob';

/** The active-PC bracket corner (own asset), excluded from the bake. */
const BRACKET_TILE = 0x006;

/** tools/gen/battle_stance.py: the battle entry stance (combatant idle OBJ) as src/data/battle_stance.h. */
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
