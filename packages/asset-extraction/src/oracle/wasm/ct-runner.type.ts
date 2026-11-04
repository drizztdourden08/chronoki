/* @layer shared-asset-extraction @kind types */
import type { CtOutcome } from './ct-invocation.type';
import type { ModuleFactory, ModuleOptions } from './emscripten-module.type';

interface CtCall {
  args: string[];
  rule: boolean;
  env?: Record<string, string>;
  files?: Record<string, Uint8Array>;
  outputs?: string[];
}

type CtRunner = (call: CtCall) => Promise<CtOutcome>;

interface CtRunnerSource {
  factory: ModuleFactory;
  instantiateWasm?: ModuleOptions['instantiateWasm'] | undefined;
  rom: () => Uint8Array;
}

export type { CtCall, CtRunner, CtRunnerSource };
