/* @layer bridge-wasm @kind logic */
import type { ModuleFactory } from '@chronoki/asset-extraction';

const loadOracleFactory = async (glue: ArrayBuffer): Promise<ModuleFactory> => {
  const url = URL.createObjectURL(new Blob([glue], { type: 'text/javascript' }));
  try {
    const loaded = (await import(/* @vite-ignore */ url)) as { default: ModuleFactory };
    return loaded.default;
  } finally {
    URL.revokeObjectURL(url);
  }
};

export { loadOracleFactory };
