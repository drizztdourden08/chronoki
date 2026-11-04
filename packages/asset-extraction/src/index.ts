/* @layer shared-placeholder @kind barrel */
import type { PackagePlaceholder } from './placeholder.type';
export { PLACEHOLDER } from './index.constants';

export type { PackagePlaceholder };

export { buildPack } from './tables/build-pack';
export { createCtasBuilder } from './ctas/ctas-builder';
export { mergeTablesInto, tableContainer } from './ctas/table-container';
export { readCtas } from './ctas/read-ctas';
export { NATIVE64_ABI, WASM32_ABI } from './tables/table-abi.constants';
export { createImportContext } from './pipeline/create-import-context';
export { createMemWorkStore } from './pipeline/mem-work-store';
export { runPipeline } from './pipeline/run-pipeline';
export { STAGES, STEP_TOTAL } from './pipeline/stages.constants';
export { loadRom } from './rom/load-rom';
export { createWasmOracle } from './oracle/wasm/wasm-oracle';
export { createWasmInstantiator } from './oracle/wasm/wasm-instantiator';
export type { EmscriptenModule, ModuleFactory, ModuleOptions } from './oracle/wasm/emscripten-module.type';
export type { WasmOracle, WasmOracleOptions } from './oracle/wasm/wasm-oracle.type';
export { RomError } from './rom/rom-error';
export { CT_ROM_SHA1 } from './rom/rom.constants';
export type { OracleDriver, OracleResult, OracleRun } from './oracle/oracle-driver.type';
export type { PipelineResult } from './pipeline/run-pipeline.type';
export type { ProgressEvent, ProgressSink } from './pipeline/progress.type';
export type { ImportContext, KitSources } from './pipeline/import-context.type';
export type { ImportStage, StageDef } from './pipeline/stage.type';
export type { WorkStore } from './pipeline/work-store.type';
export type { TableAbi } from './tables/table-abi.type';
