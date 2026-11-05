/* @layer renderer-lib @kind logic */
import { fetchToBytes } from '@app/download/download';
import { lastPathSegment } from '../last-path-segment';
import type { RomImportResult } from '../rom-files';
import { importRomJob } from './import-rom-job';

const nameFromUrl = (url: string): string => lastPathSegment(url) || 'rom.sfc';

const importUrl = (url: string): Promise<RomImportResult> =>
  importRomJob(async (report) => ({
    fileName: nameFromUrl(url),
    bytes: await fetchToBytes(url, (loaded, total) => report.count('download', loaded, total ?? undefined)),
  }));

export { importUrl };
