/* @layer shared-asset-extraction @kind logic */
import type { CtOutcome } from './ct-invocation.type';
import type { ModuleFactory, ModuleOptions } from './emscripten-module.type';
import { BASE_ENV, NOT_ORACLE_STATUS, RULE_ENV, ROM_PATH } from './wasm-paths.constants';
import { runCt } from './run-ct';

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

const tailOf = (outcome: CtOutcome): string => [...outcome.stdout.slice(-8), ...outcome.stderr.slice(-8)].join('\n');

const createCtRunner =
  (source: CtRunnerSource): CtRunner =>
  async (call) => {
    const outcome = await runCt(
      source.factory,
      {
        argv: [ROM_PATH, ...call.args],
        env: { ...BASE_ENV, ...(call.rule ? RULE_ENV : {}), ...call.env },
        files: { [ROM_PATH]: source.rom(), ...call.files },
        outputs: call.outputs ?? [],
      },
      source.instantiateWasm,
    );
    if (outcome.status === NOT_ORACLE_STATUS) {
      throw new Error(`ct.exe ${call.args[0]}: the WASM oracle build (CT_ORACLE_ONLY) does not link this mode (docs/p3-findings.md)`);
    }
    return outcome;
  };

export { createCtRunner, tailOf };
export type { CtCall, CtRunner, CtRunnerSource };
