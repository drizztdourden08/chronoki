/* @layer shared-asset-extraction @kind logic */
import { BASE_ENV, NOT_ORACLE_STATUS, RULE_ENV, ROM_PATH } from './wasm-paths.constants';
import { runCt } from './run-ct';
import type { CtRunner, CtRunnerSource } from './ct-runner.type';

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

export { createCtRunner };
