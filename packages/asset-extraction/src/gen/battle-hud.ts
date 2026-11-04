/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { peekOracle } from '../oracle/peek-access';
import { recipeState } from '../oracle/recipe-state';
import { bakeMap, bg1Index, bg1Palette, cgramPalettes } from './battle-hud-bake';
import { emitHud } from './battle-hud-emit';
import { bakeBg1 } from './battle-hud-strip';
import type { GenFiles } from './oracle-gen-stage';

const STATE = 'battle_gato_press_action';
const COMMAND_SCRIPT = '100:8,0:600';
const ENEMY_SCRIPT = '100:8,0:360';

/** tools/gen/battle_hud.py: the battle-mode HUD strip (chrome, tilemaps, palettes) as src/data/battle_hud.h. */
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
