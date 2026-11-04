/* @layer shared-asset-extraction @kind constants */
import type { StageRun } from '../pipeline/stage.type';
import { writeText } from '../pipeline/write-text';
import { genBattleTrig } from './battle-trig';
import { genMenuRomdata } from './menu-romdata';
import { genMenuWingrad } from './menu-wingrad';
import { genCollSlope } from './coll-slope';
import { genOwAnim } from './ow-anim';
import { genCtRegroup } from './ct-regroup';
import { ROM_GEN_RUNNERS } from './rom-gen-runners.constants';
import { ORACLE_RUNNERS_A } from './oracle-runners-a.constants';
import { ORACLE_GEN_RUNNERS_B } from './oracle-gen-runners-b.constants';
import { XLAT_RUNNERS } from './xlat-runners.constants';

const textGenStage =
  (file: string, gen: (rom: Uint8Array) => string): StageRun =>
  async (ctx) => {
    await writeText(ctx.work, `src/data/${file}.h`, gen(ctx.rom));
  };
const GEN_RUNNERS: Record<string, StageRun> = {
  battle_trig: textGenStage('battle_trig', genBattleTrig),
  menu_romdata: textGenStage('menu_romdata', genMenuRomdata),
  menu_wingrad: textGenStage('menu_wingrad', genMenuWingrad),
  coll_slope: textGenStage('coll_slope', genCollSlope),
  ow_anim: textGenStage('ow_anim', genOwAnim),
  ct_regroup: textGenStage('ct_regroup', genCtRegroup),
  ...ROM_GEN_RUNNERS,
  ...ORACLE_RUNNERS_A,
  ...ORACLE_GEN_RUNNERS_B,
  ...XLAT_RUNNERS,
};

export { textGenStage, GEN_RUNNERS };
