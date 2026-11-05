/* @layer bridge-wasm @kind logic */
import type { CheckDef } from '../../checks/check.type';
import { CTAS_TYPE_SCRIPT } from '../../checks/gift-ops.constants';
import { readPackEntries } from '../../checks/read-pack-entries';
import type { EditPlan, PackEdit, Placement } from '../apply-seed.type';
import { scriptCopiesOf } from '../script-copies-of';
import {
  STORYLINE_ADDR, STORYLINE_AT_LEAST, STORYLINE_SKIP, STORYLINE_TEST_OP, TABAN_FIRST_GIFT, TABAN_FIRST_THRESHOLD,
  TABAN_LAST_GIFT, TABAN_LAST_THRESHOLD, TABAN_ORDER_WHY, TABAN_THRESHOLD_BACK,
} from './taban-order.constants';

const isStorylineTest = (pack: Uint8Array, at: number, threshold: number): boolean =>
  pack[at - 2] === STORYLINE_TEST_OP && pack[at - 1] === STORYLINE_ADDR && pack[at] === threshold
  && pack[at + 1] === STORYLINE_AT_LEAST && pack[at + 2] === STORYLINE_SKIP;

const thresholdAt = (check: CheckDef | undefined): number | undefined => {
  const operand = check?.patchAt?.[0];
  return operand === undefined || operand < TABAN_THRESHOLD_BACK + 2 ? undefined : operand - TABAN_THRESHOLD_BACK;
};

const swapEdits = (pack: Uint8Array, gifts: readonly CheckDef[]): PackEdit[] => {
  const first = gifts.find((check) => check.id === TABAN_FIRST_GIFT);
  const last = gifts.find((check) => check.id === TABAN_LAST_GIFT);
  const firstAt = thresholdAt(first);
  const lastAt = thresholdAt(last);
  const scriptId = first?.scriptId;
  if (scriptId === undefined || scriptId !== last?.scriptId || firstAt === undefined || lastAt === undefined) return [];
  const entries = readPackEntries(pack);
  const script = entries.find((e) => e.type === CTAS_TYPE_SCRIPT && e.id === scriptId);
  if (!script || Math.max(firstAt, lastAt) + 2 >= script.length) return [];
  const bases = scriptCopiesOf(pack, entries, script);
  const intact = bases.every((base) =>
    isStorylineTest(pack, base + firstAt, TABAN_FIRST_THRESHOLD) && isStorylineTest(pack, base + lastAt, TABAN_LAST_THRESHOLD));
  if (!intact) return [];
  return bases.flatMap((base): PackEdit[] => [
    { at: base + firstAt, old: TABAN_FIRST_THRESHOLD, next: TABAN_LAST_THRESHOLD, why: TABAN_ORDER_WHY },
    { at: base + lastAt, old: TABAN_LAST_THRESHOLD, next: TABAN_FIRST_THRESHOLD, why: TABAN_ORDER_WHY },
  ]);
};

const planTabanOrderEdits = (pack: Uint8Array, gifts: readonly CheckDef[], placement: Placement): EditPlan => {
  if (placement[TABAN_FIRST_GIFT] === undefined) return { edits: [], failed: [] };
  const edits = swapEdits(pack, gifts);
  return edits.length > 0 ? { edits, failed: [] } : { edits: [], failed: [TABAN_FIRST_GIFT] };
};

export { planTabanOrderEdits };
