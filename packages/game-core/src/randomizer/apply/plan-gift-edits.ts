/* @layer bridge-wasm @kind logic */
import type { CheckDef } from '../checks/check.type';
import { CTAS_TYPE_SCRIPT } from '../checks/gift-ops.constants';
import { readPackEntries } from '../checks/read-pack-entries';
import type { PackEntry } from '../checks/read-pack-entries.type';
import { CTAS_TYPE_LZ, LZ_DATA_AT, MAX_AWARD_ITEM } from './apply.constants';
import type { EditPlan, PackEdit, Placement } from './apply-seed.type';

const sameBytes = (pack: Uint8Array, a: number, b: number, length: number): boolean => {
  for (let i = 0; i < length; i += 1) if (pack[a + i] !== pack[b + i]) return false;
  return true;
};

const copiesOf = (pack: Uint8Array, entries: PackEntry[], script: PackEntry): number[] => [
  script.start,
  ...entries
    .filter((e) => e.type === CTAS_TYPE_LZ && e.length >= LZ_DATA_AT + script.length)
    .filter((e) => sameBytes(pack, e.start + LZ_DATA_AT, script.start, script.length))
    .map((e) => e.start + LZ_DATA_AT),
];

const giftEdits = (pack: Uint8Array, entries: PackEntry[], check: CheckDef, item: number): PackEdit[] => {
  const script = entries.find((e) => e.type === CTAS_TYPE_SCRIPT && e.id === check.scriptId);
  const spots = check.patchAt ?? [];
  const intact = script && spots.length > 0 && spots.every((p) => p < script.length && pack[script.start + p] === check.vanillaItem);
  if (!script || !intact) return [];
  return copiesOf(pack, entries, script).flatMap((base) =>
    spots.map((p) => ({ at: base + p, old: check.vanillaItem, next: item, why: check.id })),
  );
};

const planGiftEdits = (pack: Uint8Array, checks: CheckDef[], placement: Placement): EditPlan => {
  const entries = readPackEntries(pack);
  const plan: EditPlan = { edits: [], failed: [] };
  checks.forEach((check) => {
    const item = placement[check.id];
    if (item === undefined) return;
    const edits = item >= 1 && item <= MAX_AWARD_ITEM ? giftEdits(pack, entries, check, item) : [];
    if (edits.length > 0) plan.edits.push(...edits);
    else plan.failed.push(check.id);
  });
  return plan;
};

export { planGiftEdits };
