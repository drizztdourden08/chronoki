/* @layer bridge-wasm @kind logic */
import { WASM32_ABI, createImportContext, createWasmInstantiator, createWasmOracle, runPipeline } from '@chronoki/asset-extraction';
import { defineStep } from './define-step';
import { IMPORT_OUT_DIR, PLAYER_ASSETS_PATH } from './extract-steps.constants';
import { loadOracleFactory } from './load-oracle-factory';

const assetsStep = defineStep<'assets'>(async ({ oracleWasm, oracleGlue, kit }, { romBytes }, report) => {
  const createModule = await loadOracleFactory(oracleGlue);
  const oracle = createWasmOracle({ createModule, instantiateWasm: createWasmInstantiator(oracleWasm) });
  const ctx = createImportContext(romBytes, {
    abi: WASM32_ABI,
    oracle,
    kit,
    outDir: IMPORT_OUT_DIR,
    log: (message) => report.log(message),
  });
  const result = await runPipeline(ctx, (event) => report.progress(event.fraction, `${event.label} (${event.step}/${event.steps})`));
  const assets = await ctx.work.readBytes(PLAYER_ASSETS_PATH);
  if (!result.complete || !assets) {
    const failure = result.failed[0];
    throw new Error(failure ? `${failure.stageId}: ${failure.message}` : 'The import did not produce the game assets.');
  }
  return assets;
});

export { assetsStep };
