/* @layer shared-asset-extraction @kind logic */
import type { TeleportRequest } from '../../gen/ctgen/oracle-tools.type';
import type { CpuTraceRequest } from '../../gen/xlat/cpu-trace.type';
import type { ToolRequest } from '../oracle-capture.type';
import { tailOf } from './ct-runner';
import type { CtRunner } from './ct-runner';
import { OUT_DIR, STATE_IN, STATE_OUT } from './wasm-paths.constants';

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

const substitute = (arg: string, hasState: boolean, inputs: string[]): string =>
  arg
    .replaceAll('{state}', hasState ? STATE_IN : '{state}')
    .replace(/\{in:([^}]+)\}/g, (m, name: string) => (inputs.includes(name) ? `/in/${name}` : m))
    .replace(/\{out:([^}]+)\}/g, (_m, name: string) => `${OUT_DIR}/${name}`);

const toolCall = async (ct: CtRunner, req: ToolRequest): Promise<Record<string, Uint8Array>> => {
  const names = Object.keys(req.inputs);
  const outcome = await ct({
    args: req.args.map((a) => substitute(a, req.state !== null, names)),
    rule: false,
    files: {
      ...(req.state ? { [STATE_IN]: req.state } : {}),
      ...Object.fromEntries(names.map((n) => [`/in/${n}`, req.inputs[n] as Uint8Array])),
    },
    outputs: req.outputs.map((o) => `${OUT_DIR}/${o}`),
  });
  const got: Record<string, Uint8Array> = {};
  for (const o of req.outputs) {
    const data = outcome.files[`${OUT_DIR}/${o}`];
    if (data) got[o] = data;
  }
  return got;
};

export { cpuTraceCall, owforceCall, substitute, teleportCall, toolCall };
