/* @layer shared-asset-extraction @kind logic */
import type { ModuleOptions } from './emscripten-module.type';

/**
 * Emscripten's `instantiateWasm` hook over one compiled WebAssembly.Module: the .wasm is compiled once, every fresh
 * module instance (one per ct.exe run) is only instantiated from it. The host passes the bytes (or a compiled module)
 * and its factory must honour `options.instantiateWasm`, which the MODULARIZE glue does.
 */
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
