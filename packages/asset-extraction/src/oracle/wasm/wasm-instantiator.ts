/* @layer shared-asset-extraction @kind logic */
import type { ModuleOptions } from './emscripten-module.type';

const createWasmInstantiator = (wasm: BufferSource | WebAssembly.Module): NonNullable<ModuleOptions['instantiateWasm']> => {
  let compiled: Promise<WebAssembly.Module> | null = null;
  const moduleOf = (): Promise<WebAssembly.Module> => {
    compiled ??= wasm instanceof WebAssembly.Module ? Promise.resolve(wasm) : WebAssembly.compile(wasm);
    return compiled;
  };
  return (imports, done) => {
    void moduleOf()
      .then(async (module) => done(await WebAssembly.instantiate(module, imports), module));
    return {};
  };
};

export { createWasmInstantiator };
