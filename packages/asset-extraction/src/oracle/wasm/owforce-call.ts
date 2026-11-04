/* @layer shared-asset-extraction @kind logic */
import { tailOf } from './tail-of';
import type { CtRunner } from './ct-runner.type';
import { STATE_IN, STATE_OUT } from './wasm-paths.constants';

const owforceCall = async (ct: CtRunner, state: Uint8Array, world: number): Promise<Uint8Array> => {
  const outcome = await ct({
    args: ['--owforce', STATE_IN, String(world), STATE_OUT],
    rule: false,
    files: { [STATE_IN]: state },
    outputs: [STATE_OUT],
  });
  const got = outcome.files[STATE_OUT];
  if (outcome.status !== 0 || !got) throw new Error(`ct.exe --owforce ${world} failed (exit ${outcome.status})\n${tailOf(outcome)}`);
  return got;
};

export { owforceCall };
