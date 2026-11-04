/* @layer shared-asset-extraction @kind logic */
import { toolCall } from './mode-calls';
import { cpuTraceCall } from './cpu-trace-call';
import { owforceCall } from './owforce-call';
import { teleportCall } from './teleport-call';
import { createCtRunner } from './ct-runner';
import { peekCall } from './peek-calls';
import { powerOnCall } from './power-on-call';
import { monitorCall } from './monitor-call';
import { peekShotsCall } from './peek-shots-call';
import { runRecipeSteps } from './run-recipe';
import type { WasmOracle, WasmOracleOptions } from './wasm-oracle.type';
import { DEFAULT_TAG } from './wasm-oracle.constants';

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
    boot: (bytes) => {
      rom = bytes;
      return Promise.resolve();
    },
    dispose: () => {
      rom = null;
      return Promise.resolve();
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
