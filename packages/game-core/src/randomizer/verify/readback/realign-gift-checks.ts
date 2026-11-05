/* @layer bridge-wasm @kind logic */
import type { CheckDef } from '../../checks/check.type';
import { findGiftOperands } from '../../checks/find-gift-operands';
import { CTAS_TYPE_SCRIPT } from '../../checks/gift-ops.constants';
import { readPackEntries } from '../../checks/read-pack-entries';
import type { GiftOperand, PackEntry } from '../../checks/read-pack-entries.type';

const scriptsOf = (pack: Uint8Array): Map<number, PackEntry> =>
  new Map(readPackEntries(pack).filter((e) => e.type === CTAS_TYPE_SCRIPT).map((e) => [e.id, e]));

const operandsOf = (pack: Uint8Array, scripts: Map<number, PackEntry>, id: number): GiftOperand[] => {
  const script = scripts.get(id);
  return script ? findGiftOperands(pack.subarray(script.start, script.start + script.length)) : [];
};

const inObject = (operands: GiftOperand[], object: number): GiftOperand[] => operands.filter((o) => o.object === object);

const movedSpot = (was: GiftOperand[], now: GiftOperand[], patchAt: number): number | undefined => {
  const operand = was.find((o) => o.patchAt === patchAt);
  if (!operand) return undefined;
  const before = inObject(was, operand.object);
  const after = inObject(now, operand.object);
  return before.length === after.length ? after[before.indexOf(operand)]?.patchAt : undefined;
};

const realignGiftChecks = (before: Uint8Array, after: Uint8Array, checks: readonly CheckDef[]): CheckDef[] => {
  const beforeScripts = scriptsOf(before);
  const afterScripts = scriptsOf(after);
  return checks.map((check) => {
    if (check.kind !== 'gift' || check.scriptId === undefined || !check.patchAt) return check;
    const was = operandsOf(before, beforeScripts, check.scriptId);
    const now = operandsOf(after, afterScripts, check.scriptId);
    const spots = check.patchAt.map((p) => movedSpot(was, now, p));
    return spots.every((p): p is number => p !== undefined) ? { ...check, patchAt: spots } : check;
  });
};

export { realignGiftChecks };
