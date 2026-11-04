/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { recipeState } from '../oracle/recipe-state';
import { writeE3 } from './animeng-gato/e3';
import { writeE4 } from './animeng-gato/e4';
import { writeSheet } from './animeng-gato/sheet';
import type { GenFiles } from './oracle-gen-stage';

/** tools/gen/animeng_gato.py: the stage-1 GATO pose-engine headers (E3 records, pose windows, sheet fixture). */
const genAnimengGato = async (ctx: ImportContext): Promise<GenFiles> => ({
  'animeng_e3_gato.h': writeE3(ctx.rom),
  'animeng_e4_gato.h': writeE4(),
  'animeng_sheet_gato.h': writeSheet(await recipeState(ctx, 'gato_inbattle')),
});

export { genAnimengGato };
