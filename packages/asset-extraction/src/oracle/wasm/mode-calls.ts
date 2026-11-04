/* @layer shared-asset-extraction @kind logic */
import type { ToolRequest } from '../oracle-capture.type';
import type { CtRunner } from './ct-runner.type';
import { OUT_DIR, STATE_IN } from './wasm-paths.constants';

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

export { toolCall };
