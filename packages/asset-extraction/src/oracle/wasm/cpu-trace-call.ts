/* @layer shared-asset-extraction @kind logic */
import type { CpuTraceRequest } from '../../gen/xlat/cpu-trace.type';
import { tailOf } from './tail-of';
import type { CtRunner } from './ct-runner.type';
import { OUT_DIR, STATE_IN } from './wasm-paths.constants';

const cpuTraceCall = async (ct: CtRunner, req: CpuTraceRequest): Promise<string> => {
  const out = `${OUT_DIR}/cputrace.txt`;
  const outcome = await ct({
    args: ['--cputrace', STATE_IN, String(req.frames), out],
    rule: true,
    env: req.env,
    files: { [STATE_IN]: req.state },
    outputs: [out],
  });
  const text = outcome.files[out];
  if (!text) throw new Error(`ct.exe --cputrace wrote nothing (exit ${outcome.status})\n${tailOf(outcome)}`);
  return new TextDecoder().decode(text);
};

export { cpuTraceCall };
