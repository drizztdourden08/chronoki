/* @layer shared-asset-extraction @kind logic */
import type { OracleResult, OracleRun } from '../oracle-driver.type';
import { tailOf } from './tail-of';
import type { CtCall, CtRunner } from './ct-runner.type';
import { stepCall } from './recipe-argv';
import type { StepCall } from './recipe-argv.type';
import { RAW_OUT, SRAM_IN, STATE_IN, STATE_OUT } from './wasm-paths.constants';
import { SIDECARS } from './run-recipe.constants';

const stepRequest = (call: StepCall, current: Uint8Array | null, sram: Uint8Array | null): CtCall => ({
  args: call.args,
  rule: true,
  env: { ...call.env, ...(sram ? { CT_ORACLE_SRAM: SRAM_IN } : {}) },
  files: { ...(call.needsState && current ? { [STATE_IN]: current } : {}), ...(sram ? { [SRAM_IN]: sram } : {}) },
  outputs: [STATE_OUT, ...SIDECARS.map((s) => `${RAW_OUT}.${s}`)],
});

const collectSidecars = (files: Record<string, Uint8Array>, sidecars: OracleResult['sidecars']): void => {
  for (const s of SIDECARS) {
    const data = files[`${RAW_OUT}.${s}`];
    if (data) sidecars[s] = data;
  }
};

const runRecipeSteps = async (ct: CtRunner, run: OracleRun): Promise<OracleResult> => {
  let current = run.parentState;
  let result: OracleResult | null = null;
  for (const [i, step] of run.steps.entries()) {
    const call = stepCall(step);
    if (call.needsState && current === null) throw new Error(`recipe ${run.name}: step ${i} (${step.op}) has no state to start from`);
    const outcome = await ct(stepRequest(call, current, run.sram));
    const state = outcome.files[STATE_OUT];
    if (!state) throw new Error(`recipe ${run.name}: step ${i} (${step.op}) wrote no state (exit ${outcome.status})\n${tailOf(outcome)}`);
    current = state;
    result = { state, sidecars: {} };
    collectSidecars(outcome.files, result.sidecars);
  }
  if (result === null) {
    if (current === null) throw new Error(`recipe ${run.name}: no steps and no parent`);
    return { state: current, sidecars: {} };
  }
  return result;
};

export { runRecipeSteps };
