/* @layer bridge-wasm @kind logic */
import type { CharacterAssignment } from '../../world/recruits/character-assignment.type';
import { CHARACTER_RANDO_SPOTS } from '../../world/recruits/character-rando.constants';
import type { EditPlan, PackEdit } from '../apply-seed.type';
import { createRomSpace } from '../tech-order/create-rom-space';
import { namedTableOf } from '../tech-order/named-table-of';
import { levelRecord } from './level-record';
import { OFF_LEVEL, RECORD_BYTES } from './level-record.constants';
import { CHAR_BASE_TABLE, KIND_BYTE, ORIGINAL_KEEP_RANGES } from './plan-duplicate-record-edits.constants';
import { CHARACTER_IDS } from './recruit-spot-edits.constants';

const recordOf = (pack: Uint8Array, base: number, id: number): Uint8Array => pack.slice(base + id * RECORD_BYTES, base + (id + 1) * RECORD_BYTES);

const withOriginalProgress = (kindRecord: Uint8Array, original: Uint8Array, kind: number): Uint8Array => {
  const out = kindRecord.slice();
  out[KIND_BYTE] = kind;
  for (const [from, length] of ORIGINAL_KEEP_RANGES) out.set(original.subarray(from, from + length), from);
  return out;
};

const planDuplicateRecordEdits = (pack: Uint8Array, assignment: CharacterAssignment): EditPlan => {
  const table = namedTableOf(pack, CHAR_BASE_TABLE);
  if (table === null || table.size < RECORD_BYTES * 8) return { edits: [], failed: [`duplicate-characters: pack table ${CHAR_BASE_TABLE} not found`] };
  const rom = createRomSpace(pack).read;
  const edits: PackEdit[] = [];
  const failed: string[] = [];
  CHARACTER_RANDO_SPOTS.forEach((spot) => {
    const kind = assignment[spot] ?? spot;
    const slot = CHARACTER_IDS[spot];
    if (kind === spot) return;
    const original = recordOf(pack, table.at, slot);
    const leveled = levelRecord(recordOf(pack, table.at, CHARACTER_IDS[kind]), CHARACTER_IDS[kind], original[OFF_LEVEL] ?? 1, rom);
    if (leveled === null) { failed.push(`duplicate-characters: growth tables for ${kind} missing from the pack`); return; }
    const next = withOriginalProgress(leveled, original, CHARACTER_IDS[kind]);
    for (let i = 0; i < RECORD_BYTES; i += 1) {
      const at = table.at + slot * RECORD_BYTES + i;
      if (pack[at] !== next[i]) edits.push({ at, old: pack[at] ?? 0, next: next[i] ?? 0, why: `dup-record-${spot}-${kind}-b${i.toString(16)}` });
    }
  });
  return { edits, failed };
};

export { planDuplicateRecordEdits };
