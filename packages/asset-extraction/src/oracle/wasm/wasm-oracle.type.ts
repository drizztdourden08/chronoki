/* @layer shared-asset-extraction @kind types */
import type { OracleTools } from '../../gen/ctgen/oracle-tools.type';
import type { CpuTraceOracle } from '../../gen/xlat/cpu-trace.type';
import type { ToolOracle } from '../oracle-capture.type';
import type { PeekOracle } from '../peek.type';
import type { ModuleFactory, ModuleOptions } from './emscripten-module.type';

interface WasmOracleOptions {
  /** Makes a fresh Emscripten module (the glue's `ChronoKiOracle`, INVOKE_RUN=0); Electron main and the browser each supply one. */
  createModule: ModuleFactory;
  /** Reuses a compiled WebAssembly.Module across runs (createWasmInstantiator); without it each run compiles the .wasm again. */
  instantiateWasm?: ModuleOptions['instantiateWasm'] | undefined;
  /** Part of every recipe's cache key; default `chronoki-oracle-wasm`. Give the build's hash to invalidate states on a rebuild. */
  tag?: string;
}

/**
 * Every interface the stages ask the oracle for, on one object: OracleDriver (`boot(rom)`, `runRecipe`), OracleTools
 * (`powerOn`, `monitorText`, `peek`, `teleport`, `owforce`), PeekOracle, ToolOracle and CpuTraceOracle.
 */
type WasmOracle = OracleTools & PeekOracle & ToolOracle & CpuTraceOracle;

export type { WasmOracle, WasmOracleOptions };
