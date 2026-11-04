/* @layer shared-asset-extraction @kind logic */
import type { PeekDump } from '../peek.type';
import { tailOf } from './tail-of';
import type { CtRunner } from './ct-runner.type';
import { RAW_OUT, STATE_IN, STATE_OUT } from './wasm-paths.constants';
import type { PeekArgs } from './peek-calls.type';
import { dumpPaths } from './dump-paths';
import { readDump } from './read-dump';

const peekCall = async (ct: CtRunner, req: PeekArgs): Promise<PeekDump> => {
  const args = ['--peek', STATE_IN, RAW_OUT];
  if (req.script !== null) args.push('--btnscript', req.script);
  if (req.frames !== undefined && req.frames !== null) args.push('--frames', String(req.frames));
  const save = Boolean(req.save) || req.env?.PEEK_SAVE !== undefined;
  const outcome = await ct({
    args,
    rule: req.rule ?? true,
    env: { ...req.env, ...(save ? { PEEK_SAVE: STATE_OUT } : {}) },
    files: { [STATE_IN]: req.state },
    outputs: [...dumpPaths(RAW_OUT), STATE_OUT],
  });
  const dump = readDump(outcome, RAW_OUT, `--peek (${tailOf(outcome).slice(-300)})`);
  const state = outcome.files[STATE_OUT];
  return save && state ? { ...dump, state } : dump;
};

export { peekCall };
