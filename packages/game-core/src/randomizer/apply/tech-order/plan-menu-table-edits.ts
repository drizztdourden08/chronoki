/* @layer bridge-wasm @kind logic */
import type { PackEdit } from '../apply-seed.type';
import { namedTableOf } from './named-table-of';
import {
  DESC_ROW_BYTES, DESC_TABLE_NAME, FIRST_TECH_ID, LAST_TECH_ID, MP_COST_TABLE_NAME, MP_INDEX_TABLE_NAME,
} from './tech-order.constants';
import type { TechIdMaps } from './tech-id-maps-of.type';
import type { TechOrderPlan } from './tech-order.type';

const techIds = Array.from({ length: LAST_TECH_ID }, (_, i) => FIRST_TECH_ID + i);

const changed = (pack: Uint8Array, at: number, next: number, why: string): PackEdit[] =>
  (pack[at] === next ? [] : [{ at, old: pack[at] ?? 0, next, why }]);

const movedRows = (pack: Uint8Array, name: string, rowBytes: number, maps: TechIdMaps): TechOrderPlan => {
  const table = namedTableOf(pack, name);
  if (table === null || table.size < (LAST_TECH_ID + 1) * rowBytes) return { edits: [], failed: [`tech-order: menu table ${name} is not in the pack`] };
  const edits = techIds.flatMap((id) =>
    Array.from({ length: rowBytes }, (_, b) =>
      changed(pack, table.at + id * rowBytes + b, pack[table.at + maps.oldIdOf(id) * rowBytes + b] ?? 0, `tech-order: ${name} row ${id}`)).flat());
  return { edits, failed: [] };
};

const remappedValues = (pack: Uint8Array, name: string, maps: TechIdMaps): TechOrderPlan => {
  const table = namedTableOf(pack, name);
  if (table === null) return { edits: [], failed: [`tech-order: menu table ${name} is not in the pack`] };
  const edits = Array.from({ length: table.size }, (_, i) => changed(pack, table.at + i, maps.newIdOf(pack[table.at + i] ?? 0), `tech-order: ${name}`)).flat();
  return { edits, failed: [] };
};

const planMenuTableEdits = (pack: Uint8Array, maps: TechIdMaps): TechOrderPlan => {
  const plans = [
    movedRows(pack, MP_COST_TABLE_NAME, 1, maps),
    movedRows(pack, DESC_TABLE_NAME, DESC_ROW_BYTES, maps),
    remappedValues(pack, MP_INDEX_TABLE_NAME, maps),
  ];
  return { edits: plans.flatMap((p) => p.edits), failed: plans.flatMap((p) => p.failed) };
};

export { planMenuTableEdits };
