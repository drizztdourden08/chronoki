/* @layer renderer-lib @kind logic */
import { runExtractStep } from '../extraction-client';
import { platformFiles } from '../platform-files';
import { errorMessage } from '../error-message';
import { romStoreOf } from '../rom-files';
import { readOracleInputs } from './read-oracle-inputs';
import { storeAssets } from './store-assets';
import type { ExtractResult } from './assets-store.type';

const extractAssets = async (romFile: string): Promise<ExtractResult> => {
  try {
    const check = await romStoreOf(platformFiles()).read(romFile);
    if (!check?.ok) return { success: false, error: `ROM file not found or not a known dump: ${romFile}` };
    const blob = await runExtractStep<'assets', Uint8Array>({
      step: 'assets',
      title: 'Building the game assets',
      subject: romFile,
      romBytes: check.rom.bytes,
      input: await readOracleInputs(),
    });
    await storeAssets(platformFiles(), romFile, blob);
    return { success: true };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
};

export { extractAssets };
