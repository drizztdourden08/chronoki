/* @layer shared-asset-extraction @kind logic */
import type { CtOutcome } from './ct-invocation.type';
import type { ModuleFactory, ModuleOptions } from './emscripten-module.type';
import { BASE_ENV, NOT_ORACLE_STATUS, RULE_ENV, ROM_PATH } from './wasm-paths.constants';
import { runCt } from './run-ct';

/** One ct.exe call as the driver's methods describe it; the ROM is staged and passed first, as `ct.exe ROM ...`. */
interface CtCall {
  args: string[];
  /** CT_ORACLE_LOGICAL=1 (the cartridge under the logical rule). */
  rule: boolean;
  env?: Record<string, string>;
  files?: Record<string, Uint8Array>;
  outputs?: string[];
}

type CtRunner = (call: CtCall) => Promise<CtOutcome>;

interface CtRunnerSource {
  factory: ModuleFactory;
  instantiateWasm?: ModuleOptions['instantiateWasm'] | undefined;
  /** The ROM given to `boot`; a stop with a clear message before that. */
  rom: () => Uint8Array;
}

/** The last lines of what a failed ct.exe printed (recipes.py kept the tails of stdout and stderr in its log). */
const tailOf = (outcome: CtOutcome): string => [...outcome.stdout.slice(-8), ...outcome.stderr.slice(-8)].join('\n');

/** Runs ct.exe calls, each on a fresh module instance; the slim oracle build's refusal of a mode becomes a stop naming it. */
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
