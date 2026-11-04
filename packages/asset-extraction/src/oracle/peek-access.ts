/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { requireBytes } from '../pipeline/work-files';
import { statePath } from '../recipes/recipe-store';
import type { OracleRun } from './oracle-driver.type';
import type { PeekOracle } from './peek.type';

const recipeState = (ctx: ImportContext, name: string): Promise<Uint8Array> =>
  requireBytes(ctx.work, statePath(name));

const peekOracle = (ctx: ImportContext): PeekOracle => {
  const driver = ctx.oracle as (typeof ctx.oracle & Partial<PeekOracle>) | null;
  if (!driver) throw new Error('this stage needs the oracle: none was given');
  if (!driver.peek || !driver.peekShots || !driver.monitor) {
    throw new Error('this stage needs the oracle driver to implement peek, peekShots and monitor');
  }
  return driver as PeekOracle;
};

const teleportState = async (
  ctx: ImportContext,
  parentState: Uint8Array,
  step: { scene: number; tx: number; ty: number; facing: number; frames: number; method?: string },
): Promise<Uint8Array> => {
  if (!ctx.oracle) throw new Error('this stage needs the oracle: none was given');
  const run: OracleRun = {
    name: 'teleport',
    steps: [{ op: 'teleport', method: 'jmp', ...step }],
    parentState,
    sram: null,
  };
  return (await ctx.oracle.runRecipe(run)).state;
};

export { peekOracle, recipeState, teleportState };
