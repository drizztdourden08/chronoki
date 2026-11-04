/* @layer renderer-lib @kind logic */
import type { RomImportResult } from '../rom-files';
import { importRomJob } from './import-rom-job';

const importFile = (file: File): Promise<RomImportResult> =>
  importRomJob(async () => ({ fileName: file.name, bytes: new Uint8Array(await file.arrayBuffer()) }));

export { importFile };
