/* @layer shared-asset-extraction @kind logic */
import type { OracleResult, OracleRun } from '../oracle-driver.type';
import { tailOf } from './ct-runner';
import type { CtRunner } from './ct-runner';
import { stepCall } from './recipe-argv';
import { RAW_OUT, SRAM_IN, STATE_IN, STATE_OUT } from './wasm-paths.constants';

const SIDECARS = ['wram', 'vram', 'oam'] as const;

const runRecipeSteps = async (ct: CtRunner, run: OracleRun): Promise<OracleResult> => {
  let current = run.parentState;
  let result: OracleResult | null = null;
  for (const [i, step] of run.steps.entries()) {
    const call = stepCall(step);
    if (call.needsState && current === null) throw new Error(`recipe ${run.name}: step ${i} (${step.op}) has no state to start from`);
    const outcome = await ct({
      args: call.args,
      rule: true,
      env: { ...call.env, ...(run.sram ? { CT_ORACLE_SRAM: SRAM_IN } : {}) },
      files: { ...(call.needsState && current ? { [STATE_IN]: current } : {}), ...(run.sram ? { [SRAM_IN]: run.sram } : {}) },
      outputs: [STATE_OUT, ...SIDECARS.map((s) => `${RAW_OUT}.${s}`)],
    });
    const state = outcome.files[STATE_OUT];
    if (!state) throw new Error(`recipe ${run.name}: step ${i} (${step.op}) wrote no state (exit ${outcome.status})\n${tailOf(outcome)}`);
    current = state;
    result = { state, sidecars: {} };
    for (const s of SIDECARS) {
      const data = outcome.files[`${RAW_OUT}.${s}`];
      if (data) result.sidecars[s] = data;
    }
  }
  if (result === null) {
    if (current === null) throw new Error(`recipe ${run.name}: no steps and no parent`);
    return { state: current, sidecars: {} };
  }
  return result;
};

export { runRecipeSteps };
