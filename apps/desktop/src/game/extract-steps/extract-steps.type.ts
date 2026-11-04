/* @layer bridge-wasm @kind types */
import type { KitSources } from '@chronoki/asset-extraction';

type ExtractStepId = 'assets';

interface ExtractData {
  romBytes: Uint8Array;
}

interface AssetsStepInput {
  oracleWasm: ArrayBuffer;
  oracleGlue: ArrayBuffer;
  kit: KitSources;
}

interface ExtractInputs {
  assets: AssetsStepInput;
}

export type { AssetsStepInput, ExtractData, ExtractInputs, ExtractStepId };
