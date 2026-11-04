/* @layer shared-asset-extraction @kind logic */
import type { PeekDump } from '../peek.type';
import type { CtOutcome } from './ct-invocation.type';
import { tailOf } from './tail-of';
import { dumpPaths } from './dump-paths';

const readDump = (outcome: CtOutcome, base: string, what: string): PeekDump => {
  const [fb, wram, vram, oam] = dumpPaths(base).map((p) => outcome.files[p]);
  if (!fb || !wram || !vram || !oam) throw new Error(`ct.exe ${what} wrote nothing (exit ${outcome.status})\n${tailOf(outcome)}`);
  return { fb, wram, vram, oam };
};

export { readDump };
