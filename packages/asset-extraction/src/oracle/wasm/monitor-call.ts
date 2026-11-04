/* @layer shared-asset-extraction @kind logic */
import type { MonitorRequest } from '../peek.type';
import type { CtRunner } from './ct-runner.type';
import { STATE_IN } from './wasm-paths.constants';

const monitorCall = async (ct: CtRunner, req: MonitorRequest): Promise<string[]> => {
  const args = ['--monitor', req.regions, '--from', STATE_IN];
  if (req.script) args.push('--btnscript', req.script);
  if (req.frames !== undefined) args.push('--frames', String(req.frames));
  const outcome = await ct({ args, rule: req.rule ?? false, env: req.env, files: { [STATE_IN]: req.state } });
  return outcome.stdout;
};

export { monitorCall };
