/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import type { OracleRun } from './oracle-driver.type';

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

export { teleportState };
