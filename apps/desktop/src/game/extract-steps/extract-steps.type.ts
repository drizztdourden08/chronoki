/* @layer bridge-wasm @kind types */
import type { KitSources } from '@chronoki/asset-extraction';

type ExtractStepId = 'assets' | 'steam' | 'sprites';

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

interface SpritesStepInput {
  pack: Uint8Array;
}

interface ExtractInputs {
  assets: AssetsStepInput;
  steam: SteamStepInput;
  sprites: SpritesStepInput;
}

export type { AssetsStepInput, ExtractData, ExtractInputs, ExtractStepId, SpritesStepInput, SteamStepInput };
