/* @layer shared-asset-extraction @kind logic */
import { NATIVE64_ABI } from '../tables/table-abi.constants';
import type { ImportContext } from './import-context.type';
import { createMemWorkStore } from './mem-work-store';

const DEFAULT_OUT_DIR = 'build/player';

const createImportContext = (rom: Uint8Array, overrides: Partial<ImportContext> = {}): ImportContext => ({
  rom,
  work: createMemWorkStore(),
  abi: NATIVE64_ABI,
  oracle: null,
  kit: null,
  jobs: 4,
  outDir: DEFAULT_OUT_DIR,
  log: () => undefined,
  ...overrides,
});

export { createImportContext, DEFAULT_OUT_DIR };
