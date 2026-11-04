/* @layer shared-asset-extraction @kind logic */
import type { PeekDump, PeekShotsRequest } from '../peek.type';
import type { CtRunner } from './ct-runner.type';
import { OUT_DIR, STATE_IN } from './wasm-paths.constants';
import { dumpPaths } from './dump-paths';
import { readDump } from './read-dump';

const cutScript = (script: string, n: number): string => {
  const out: string[] = [];
  let left = n;
  for (const token of script.split(',')) {
    if (left <= 0) break;
    const [mask, count] = token.split(':') as [string, string];
    const k = Math.min(Number.parseInt(count, 10), left);
    out.push(`${mask}:${k}`);
    left -= k;
  }
  if (left > 0) out.push(`0:${left}`);
  return out.join(',');
};

const peekShotsCall = async (ct: CtRunner, req: PeekShotsRequest): Promise<Map<number, PeekDump>> => {
  const at = [...new Set(req.at)].sort((a, b) => a - b);
  const last = at.at(-1) ?? 0;
  const prefix = `${OUT_DIR}/shots`;
  const paths = at.flatMap((n) => dumpPaths(`${prefix}_f${n}.raw`));
  const outcome = await ct({
    args: ['--peek', STATE_IN, `${prefix}_end.raw`, '--btnscript', cutScript(req.script ?? `0:${last}`, last)],
    rule: req.rule ?? true,
    env: { ...req.env, PEEK_SHOTS: prefix, PEEK_SHOTS_AT: at.join(','), PEEK_SHOTS_SIDECARS: '1' },
    files: { [STATE_IN]: req.state },
    outputs: paths,
  });
  return new Map(at.map((n) => [n, readDump(outcome, `${prefix}_f${n}.raw`, `--peek (PEEK_SHOTS frame ${n})`)]));
};

export { peekShotsCall };
