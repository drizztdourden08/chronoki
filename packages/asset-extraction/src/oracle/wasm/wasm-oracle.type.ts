/* @layer shared-asset-extraction @kind types */
import type { OracleTools } from '../../gen/ctgen/oracle-tools.type';
import type { CpuTraceOracle } from '../../gen/xlat/cpu-trace.type';
import type { ToolOracle } from '../oracle-capture.type';
import type { PeekOracle } from '../peek.type';
import type { ModuleFactory, ModuleOptions } from './emscripten-module.type';

interface WasmOracleOptions {
  createModule: ModuleFactory;
  instantiateWasm?: ModuleOptions['instantiateWasm'] | undefined;
  tag?: string;
}

type WasmOracle = OracleTools & PeekOracle & ToolOracle & CpuTraceOracle;

export type { WasmOracle, WasmOracleOptions };
