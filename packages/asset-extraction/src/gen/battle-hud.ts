/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { peekOracle } from '../oracle/peek-access';
import { recipeState } from '../oracle/recipe-state';
import { bakeMap } from './battle-hud-bake-map';
import { bg1Index } from './battle-hud-bg1-index';
import { bg1Palette } from './battle-hud-bg1-palette';
import { cgramPalettes } from './battle-hud-cgram-palettes';
import { emitHud } from './battle-hud-emit';
import { bakeBg1 } from './battle-hud-strip';
import type { GenFiles } from './oracle-gen-stage.type';
import { STATE, COMMAND_SCRIPT, ENEMY_SCRIPT } from './battle-hud.constants';

const genBattleHud = async (ctx: ImportContext): Promise<GenFiles> => {
  const oracle = peekOracle(ctx);
  const state = await recipeState(ctx, STATE);
  const cmd = await oracle.peek({ state, script: COMMAND_SCRIPT });
  const enemy = await oracle.peek({ state, script: ENEMY_SCRIPT });
  const isoE = await oracle.peek({ state, script: ENEMY_SCRIPT, env: { PEEK_ISOBG: '0' } });
  const isoC = await oracle.peek({ state, script: COMMAND_SCRIPT, env: { PEEK_ISOBG: '0' } });
  const texE = bakeBg1(isoE);
  const texC = bakeBg1(isoC);
  const bg1Pal = bg1Palette(texE, texC);
  return {
    'battle_hud.h': emitHud({
      palE: cgramPalettes(enemy.oam),
      palC: cgramPalettes(cmd.oam),
      mapE: bakeMap(enemy.vram),
      mapC: bakeMap(cmd.vram),
      bg1Pal,
      bg1IdxE: bg1Index(texE, bg1Pal),
      bg1IdxC: bg1Index(texC, bg1Pal),
    }),
  };
};

export { genBattleHud };
