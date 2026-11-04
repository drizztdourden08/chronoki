/* @layer shared-asset-extraction @kind logic */
import { cpuTraceCall, owforceCall, teleportCall, toolCall } from './mode-calls';
import { createCtRunner } from './ct-runner';
import { monitorCall, peekCall, peekShotsCall, powerOnCall } from './peek-calls';
import { runRecipeSteps } from './run-recipe';
import type { WasmOracle, WasmOracleOptions } from './wasm-oracle.type';

const DEFAULT_TAG = 'chronoki-oracle-wasm';

/**
 * The oracle driver on the WebAssembly build of Belthasar's main.c: each ct.exe invocation of setup.py is one
 * `callMain` on a fresh module instance, with its files staged in MEMFS and its environment in ENV. The module factory is
 * injected, so Electron main and the browser both supply it; `instantiateWasm` lets them share one compiled module.
 */
const createWasmOracle = (options: WasmOracleOptions): WasmOracle => {
  let rom: Uint8Array | null = null;
  const ct = createCtRunner({
    factory: options.createModule,
    instantiateWasm: options.instantiateWasm,
    rom: () => {
      if (rom === null) throw new Error('the oracle has no ROM: boot(rom) comes first');
      return rom;
    },
  });
  return {
    tag: options.tag ?? DEFAULT_TAG,
    boot: async (bytes) => {
      rom = bytes;
    },
    dispose: async () => {
      rom = null;
    },
    runRecipe: (run) => runRecipeSteps(ct, run),
    peek: (request) => peekCall(ct, request),
    peekShots: (request) => peekShotsCall(ct, request),
    monitor: (request) => monitorCall(ct, request),
    powerOn: (request) => powerOnCall(ct, request),
    teleport: (request) => teleportCall(ct, request),
    monitorText: async (state, regs, frames) =>
      (await monitorCall(ct, { state, regions: regs, frames, rule: true })).join('\n'),
    owforce: (state, world) => owforceCall(ct, state, world),
    tool: (request) => toolCall(ct, request),
    cpuTrace: (request) => cpuTraceCall(ct, request),
  };
};

export { createWasmOracle };
