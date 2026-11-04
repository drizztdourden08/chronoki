/* @layer renderer-lib @kind logic */
import { portKitApi } from '@drizztdourden08/brock-port-kit/renderer';
import type { KitSources } from '@chronoki/asset-extraction';
import type { AssetsStepInput } from '@app/game/extract-steps';
import { ORACLE_GLUE_FILE, ORACLE_KIT_FILE, ORACLE_WASM_FILE } from './assets-store.constants';

const isHttpRenderer = (): boolean => window.location.protocol === 'http:' || window.location.protocol === 'https:';

const fetchBundled = async (file: string): Promise<ArrayBuffer | null> => {
  const res = await fetch(new URL(file, window.location.href).href);
  return res.ok ? res.arrayBuffer() : null;
};

const readBundled = async (file: string): Promise<ArrayBuffer> => {
  const bytes = isHttpRenderer() ? await fetchBundled(file) : await portKitApi()?.readCore(file);
  if (!bytes) throw new Error(`The importer file ${file} is not in the app bundle.`);
  return bytes;
};

const readOracleInputs = async (): Promise<AssetsStepInput> => {
  const [oracleWasm, oracleGlue, kitBytes] = await Promise.all([
    readBundled(ORACLE_WASM_FILE),
    readBundled(ORACLE_GLUE_FILE),
    readBundled(ORACLE_KIT_FILE),
  ]);
  const kit = JSON.parse(new TextDecoder().decode(kitBytes)) as KitSources;
  return { oracleWasm, oracleGlue, kit };
};

export { readOracleInputs };
