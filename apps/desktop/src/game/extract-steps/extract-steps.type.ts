/* @layer bridge-wasm @kind types */
import type { KitSources } from '@chronoki/asset-extraction';

type ExtractStepId = 'assets' | 'steam';

interface ExtractData {
  romBytes: Uint8Array;
}

interface AssetsStepInput {
  oracleWasm: ArrayBuffer;
  oracleGlue: ArrayBuffer;
  kit: KitSources;
}

interface SteamStepInput {
  file: File;
}

interface ExtractInputs {
  assets: AssetsStepInput;
  steam: SteamStepInput;
}

export type { AssetsStepInput, ExtractData, ExtractInputs, ExtractStepId, SteamStepInput };
