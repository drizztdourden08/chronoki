/* @layer shared-asset-extraction @kind logic */
import type { StageRun } from '../pipeline/stage.type';
import { writeText } from '../pipeline/work-files';
import { genBattleTrig } from './battle-trig';
import { genCollSlope } from './coll-slope';
import { genCtRegroup } from './ct-regroup';
import { genMenuRomdata } from './menu-romdata';
import { genMenuWingrad } from './menu-wingrad';
import { ORACLE_RUNNERS_A } from './oracle-runners-a';
import { ORACLE_GEN_RUNNERS_B } from './oracle-gen-runners-b';
import { genOwAnim } from './ow-anim';
import { XLAT_RUNNERS } from './xlat-runners';

/** A generator that reads only the ROM and writes src/data/<name>.h into the workdir (the file the C build would include). */
const textGenStage =
  (file: string, gen: (rom: Uint8Array) => string): StageRun =>
  async (ctx) => {
    await writeText(ctx.work, `src/data/${file}.h`, gen(ctx.rom));
  };

/** Stage id -> runner, for the generators ported so far. Every id here must be 'ported' in generate.stages.ts. */
const GEN_RUNNERS: Record<string, StageRun> = {
  battle_trig: textGenStage('battle_trig', genBattleTrig),
  menu_romdata: textGenStage('menu_romdata', genMenuRomdata),
  menu_wingrad: textGenStage('menu_wingrad', genMenuWingrad),
  coll_slope: textGenStage('coll_slope', genCollSlope),
  ow_anim: textGenStage('ow_anim', genOwAnim),
  ct_regroup: textGenStage('ct_regroup', genCtRegroup),
  ...ORACLE_RUNNERS_A,
  ...ORACLE_GEN_RUNNERS_B,
  ...XLAT_RUNNERS,
};

export { GEN_RUNNERS, textGenStage };
