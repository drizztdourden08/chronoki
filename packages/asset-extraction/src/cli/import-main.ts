/* @layer shared-asset-extraction @kind logic */
import { readFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { createImportContext } from '../pipeline/create-import-context';
import { runPipeline } from '../pipeline/run-pipeline';
import { STAGES } from '../pipeline/stages.constants';
import { buildImportOverrides } from './build-import-overrides';
import { copyPackFiles } from './copy-pack-files';
import { createFsWorkStore } from './fs-work-store';
import { createProgressLogger } from './create-progress-logger';
import { errLine } from './err-line';
import { failureLine } from './failure-line';
import { DEFAULT_WORK_DIR, EXIT_INCOMPLETE, EXIT_USAGE, IMPORT_OPTIONS, IMPORT_USAGE } from './import-main.constants';
import { outLine } from './out-line';
import { requiredImportArgs } from './required-import-args';
import { selectStages } from './select-stages';

const importRom = async (argv: string[]): Promise<number> => {
  const { values } = parseArgs({ args: argv, options: IMPORT_OPTIONS });
  const required = requiredImportArgs(values);
  if (required === null) {
    errLine(IMPORT_USAGE);
    return EXIT_USAGE;
  }
  const { rom, belthasar, out, abi } = required;
  const work = createFsWorkStore(values.work ?? DEFAULT_WORK_DIR);
  const overrides = await buildImportOverrides(belthasar, abi, work, values);
  const ctx = createImportContext(new Uint8Array(await readFile(rom)), overrides);
  const selected = selectStages(STAGES, values.only, values.from);
  const partial = selected.length !== STAGES.length;
  const result = await runPipeline(ctx, createProgressLogger(STAGES), selected);
  if (result.failed.length > 0) {
    errLine(failureLine(result));
    return 1;
  }
  if (partial) {
    outLine(`import ${abi.name}: ${result.done.length} done, ${result.skipped.length} skipped (partial run, nothing copied)`);
    return 0;
  }
  const copied = await copyPackFiles(work, ctx.outDir, out);
  outLine(`import ${abi.name}: ${result.done.length} done, ${result.skipped.length} skipped; wrote ${copied.join(', ') || 'nothing'} -> ${out}`);
  if (result.skipped.length > 0) {
    errLine(`incomplete, skipped stages: ${result.skipped.join(', ')}`);
    return EXIT_INCOMPLETE;
  }
  return 0;
};

export { importRom };
