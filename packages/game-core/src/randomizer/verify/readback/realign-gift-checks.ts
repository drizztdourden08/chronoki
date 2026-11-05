/* @layer bridge-wasm @kind logic */
import type { CheckDef } from '../../checks/check.type';
import { findGiftOperands } from '../../checks/find-gift-operands';
import { CTAS_TYPE_SCRIPT } from '../../checks/gift-ops.constants';
import { readPackEntries } from '../../checks/read-pack-entries';
import type { PackEntry } from '../../checks/read-pack-entries.type';

const scriptsOf = (pack: Uint8Array): Map<number, PackEntry> =>
  new Map(readPackEntries(pack).filter((e) => e.type === CTAS_TYPE_SCRIPT).map((e) => [e.id, e]));

const operandSpots = (pack: Uint8Array, scripts: Map<number, PackEntry>, id: number): number[] => {
  const script = scripts.get(id);
  return script ? findGiftOperands(pack.subarray(script.start, script.start + script.length)).map((o) => o.patchAt) : [];
};

const realignGiftChecks = (before: Uint8Array, after: Uint8Array, checks: readonly CheckDef[]): CheckDef[] => {
  const beforeScripts = scriptsOf(before);
  const afterScripts = scriptsOf(after);
  return checks.map((check) => {
    if (check.kind !== 'gift' || check.scriptId === undefined || !check.patchAt) return check;
    const was = operandSpots(before, beforeScripts, check.scriptId);
    const now = operandSpots(after, afterScripts, check.scriptId);
    if (was.length !== now.length) return check;
    const spots = check.patchAt.map((p) => now[was.indexOf(p)]);
    return spots.every((p) => p !== undefined) ? { ...check, patchAt: spots as number[] } : check;
  });
};

export { realignGiftChecks };
