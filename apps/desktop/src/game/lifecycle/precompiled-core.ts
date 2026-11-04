/* @layer bridge-wasm @kind logic */
import { compileCore } from '@drizztdourden08/brock-port-kit/renderer';
import { CHRONOKI_PORT } from '@chronoki/game-core';

const compiled: { promise: Promise<WebAssembly.Module> | null } = { promise: null };

const precompiledCore = (): Promise<WebAssembly.Module> => {
  compiled.promise ??= compileCore(CHRONOKI_PORT);
  return compiled.promise;
};

export { precompiledCore };
