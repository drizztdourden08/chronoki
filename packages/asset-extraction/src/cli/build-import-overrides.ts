/* @layer shared-asset-extraction @kind logic */
import { fileURLToPath } from 'node:url';
import { loadKitSources } from '../kit/load-kit-sources';
import { createWasmOracle } from '../oracle/wasm/wasm-oracle';
import type { ImportContext } from '../pipeline/import-context.type';
import type { TableAbi } from '../tables/table-abi.type';
import { GLUE_RELATIVE_PATH } from './import-main.constants';
import { loadOracleFactory } from './load-oracle-factory';
import { outLine } from './out-line';

const buildImportOverrides = async (
  belthasar: string,
  abi: TableAbi,
  work: ImportContext['work'],
  options: { glue?: string | undefined; jobs?: string | undefined },
): Promise<Partial<ImportContext>> => {
  const glue = options.glue ?? fileURLToPath(new URL(GLUE_RELATIVE_PATH, import.meta.url));
  return {
    oracle: createWasmOracle({ createModule: loadOracleFactory(glue) }),
    kit: await loadKitSources(belthasar),
    abi,
    work,
    log: outLine,
    ...(options.jobs === undefined ? {} : { jobs: Number(options.jobs) }),
  };
};

export { buildImportOverrides };
