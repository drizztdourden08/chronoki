/* @layer shared-asset-extraction @kind logic */
import type { TeleportRequest } from '../../gen/ctgen/oracle-tools.type';
import { tailOf } from './tail-of';
import type { CtRunner } from './ct-runner.type';
import { STATE_IN, STATE_OUT } from './wasm-paths.constants';

const teleportCall = async (ct: CtRunner, req: TeleportRequest): Promise<Uint8Array> => {
  const outcome = await ct({
    args: [
      '--teleport', String(req.scene), String(req.tx), String(req.ty), String(req.facing),
      '--from', STATE_IN, '--frames', String(req.frames), '--out', STATE_OUT,
    ],
    rule: true,
    files: { [STATE_IN]: req.start },
    outputs: [STATE_OUT],
  });
  const state = outcome.files[STATE_OUT];
  if (!state) throw new Error(`ct.exe --teleport wrote no state (exit ${outcome.status})\n${tailOf(outcome)}`);
  return state;
};

export { teleportCall };
