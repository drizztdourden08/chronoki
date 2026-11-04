/* @layer shared-asset-extraction @kind logic */
import type { BootRequest, BootResult } from '../../gen/ctgen/oracle-tools.type';
import type { MonitorRequest, PeekDump, PeekShotsRequest } from '../peek.type';
import type { CtOutcome } from './ct-invocation.type';
import { tailOf } from './ct-runner';
import type { CtRunner } from './ct-runner';
import { OUT_DIR, RAW_OUT, SRAM_IN, STATE_IN, STATE_OUT } from './wasm-paths.constants';

interface PeekArgs {
  state: Uint8Array;
  script: string | null;
  env?: Record<string, string>;
  rule?: boolean;
  frames?: number | null;
  save?: boolean;
}

const DUMP_EXT = ['', '.wram', '.vram', '.oam'];
const dumpPaths = (base: string): string[] => DUMP_EXT.map((e) => `${base}${e}`);

const readDump = (outcome: CtOutcome, base: string, what: string): PeekDump => {
  const [fb, wram, vram, oam] = dumpPaths(base).map((p) => outcome.files[p]);
  if (!fb || !wram || !vram || !oam) throw new Error(`ct.exe ${what} wrote nothing (exit ${outcome.status})\n${tailOf(outcome)}`);
  return { fb, wram, vram, oam };
};

const peekCall = async (ct: CtRunner, req: PeekArgs): Promise<PeekDump> => {
  const args = ['--peek', STATE_IN, RAW_OUT];
  if (req.script !== null) args.push('--btnscript', req.script);
  if (req.frames !== undefined && req.frames !== null) args.push('--frames', String(req.frames));
  const outcome = await ct({
    args,
    rule: req.rule ?? true,
    env: { ...(req.save ? { PEEK_SAVE: STATE_OUT } : {}), ...req.env },
    files: { [STATE_IN]: req.state },
    outputs: [...dumpPaths(RAW_OUT), STATE_OUT],
  });
  const dump = readDump(outcome, RAW_OUT, `--peek (${tailOf(outcome).slice(-300)})`);
  const state = outcome.files[STATE_OUT];
  return req.save && state ? { ...dump, state } : dump;
};

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

const monitorCall = async (ct: CtRunner, req: MonitorRequest): Promise<string[]> => {
  const args = ['--monitor', req.regions, '--from', STATE_IN];
  if (req.script) args.push('--btnscript', req.script);
  if (req.frames !== undefined) args.push('--frames', String(req.frames));
  const outcome = await ct({ args, rule: req.rule ?? false, env: req.env, files: { [STATE_IN]: req.state } });
  return outcome.stdout;
};

const powerOnCall = async (ct: CtRunner, req: BootRequest): Promise<BootResult> => {
  const outcome = await ct({
    args: ['--fb', RAW_OUT, '--frames', String(req.frames)],
    rule: true,
    env: { PEEK_SAVE: STATE_OUT, ...(req.sram ? { CT_ORACLE_SRAM: SRAM_IN } : {}) },
    files: req.sram ? { [SRAM_IN]: req.sram } : {},
    outputs: [...dumpPaths(RAW_OUT), STATE_OUT],
  });
  const state = outcome.files[STATE_OUT];
  if (!state) throw new Error(`ct.exe --fb wrote no state (exit ${outcome.status})\n${tailOf(outcome)}`);
  return { ...readDump(outcome, RAW_OUT, '--fb'), state };
};

export { cutScript, monitorCall, peekCall, peekShotsCall, powerOnCall };
export type { PeekArgs };
