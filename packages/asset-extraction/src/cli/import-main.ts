/* @layer shared-asset-extraction @kind logic */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { loadKitSources } from '../kit/load-kit-sources';
import { createWasmOracle } from '../oracle/wasm/wasm-oracle';
import { createImportContext } from '../pipeline/create-import-context';
import { runPipeline } from '../pipeline/run-pipeline';
import { STAGES } from '../pipeline/stages.constants';
import { copyPackFiles } from './copy-pack-files';
import { createFsWorkStore } from './fs-work-store';
import { createProgressLogger } from './create-progress-logger';
import { errLine } from './err-line';
import { DEFAULT_WORK_DIR, EXIT_INCOMPLETE, EXIT_USAGE, GLUE_RELATIVE_PATH, IMPORT_USAGE } from './import-main.constants';
import { loadOracleFactory } from './load-oracle-factory';
import { outLine } from './out-line';
import { selectStages } from './select-stages';
import { ABIS } from './repack-main.constants';

const OPTIONS = {
  rom: { type: 'string' },
  belthasar: { type: 'string' },
  abi: { type: 'string' },
  out: { type: 'string' },
  work: { type: 'string' },
  jobs: { type: 'string' },
  glue: { type: 'string' },
  only: { type: 'string' },
  from: { type: 'string' },
} as const;

const importRom = async (argv: string[]): Promise<number> => {
  const { values } = parseArgs({ args: argv, options: OPTIONS });
  const abi = ABIS[values.abi ?? ''];
  if (values.rom === undefined || values.belthasar === undefined || values.out === undefined || abi === undefined) {
    errLine(IMPORT_USAGE);
    return EXIT_USAGE;
  }
  const glue = values.glue ?? fileURLToPath(new URL(GLUE_RELATIVE_PATH, import.meta.url));
  const work = createFsWorkStore(values.work ?? DEFAULT_WORK_DIR);
  const overrides = {
    oracle: createWasmOracle({ createModule: loadOracleFactory(glue) }),
    kit: await loadKitSources(values.belthasar),
    abi,
    work,
    log: outLine,
    ...(values.jobs === undefined ? {} : { jobs: Number(values.jobs) }),
  };
  const ctx = createImportContext(new Uint8Array(await readFile(values.rom)), overrides);
  const selected = selectStages(STAGES, values.only, values.from);
  const partial = selected.length !== STAGES.length;
  const result = await runPipeline(ctx, createProgressLogger(STAGES), selected);
  if (result.failed.length > 0) {
    const first = result.failed[0];
    errLine(`import failed at ${first?.stageId ?? '?'}: ${first?.message ?? ''}`);
    return 1;
  }
  if (partial) {
    outLine(`import ${abi.name}: ${result.done.length} done, ${result.skipped.length} skipped (partial run, nothing copied)`);
    return 0;
  }
  const copied = await copyPackFiles(work, ctx.outDir, values.out);
  outLine(`import ${abi.name}: ${result.done.length} done, ${result.skipped.length} skipped; wrote ${copied.join(', ') || 'nothing'} -> ${values.out}`);
  if (result.skipped.length > 0) {
    errLine(`incomplete, skipped stages: ${result.skipped.join(', ')}`);
    return EXIT_INCOMPLETE;
  }
  return 0;
};

export { importRom };
