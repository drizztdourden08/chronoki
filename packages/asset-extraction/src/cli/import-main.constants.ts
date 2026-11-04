/* @layer shared-asset-extraction @kind constants */
const IMPORT_USAGE =
  'usage: node --experimental-wasm-jspi packages/asset-extraction/src/cli/import.ts --rom <file> --belthasar <dir> --abi native64|wasm32 --out <dir> [--work <dir>] [--jobs n] [--glue <chronoki-oracle.js>] [--only <id,id,...>] [--from <id>]';

const JSPI_FLAG = '--experimental-wasm-jspi';

const DEFAULT_WORK_DIR = '.import-work';

const GLUE_RELATIVE_PATH = '../../../../core/wasm-build/out/oracle/chronoki-oracle.js';

const PACK_FILES = ['ct_assets.dat', 'ct_wide.dat'];

const EXIT_USAGE = 2;

const EXIT_INCOMPLETE = 3;

const IMPORT_OPTIONS = {
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

export { DEFAULT_WORK_DIR, EXIT_INCOMPLETE, EXIT_USAGE, GLUE_RELATIVE_PATH, IMPORT_OPTIONS, IMPORT_USAGE, JSPI_FLAG, PACK_FILES };
