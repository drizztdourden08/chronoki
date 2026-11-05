/* @layer bridge-wasm @kind logic */
import { CTAS_TYPE_TABLE } from '../../checks/checks.constants';
import { readPackEntries } from '../../checks/read-pack-entries';
import type { EditPlan, PackEdit } from '../apply-seed.type';
import { encodeItemName } from './encode-item-name';
import {
  ICON_SOURCE_ITEM_ID, ITEM_PROP_PACK_ID, ITEM_PROP_PACK_TYPE, JETS_ITEM_ID, JETS_ITEM_NAME, KEY_ITEM_PROP, NAME_RECORD_BYTES,
  NAME_SPACE, NAME_TABLE_ROM,
} from './jets-item.constants';

const WHY = 'jets-of-time-item';

const bytesEdit = (pack: Uint8Array, at: number, next: number[]): PackEdit[] =>
  next.flatMap((value, i): PackEdit[] => ((pack[at + i] ?? value) === value ? [] : [{ at: at + i, old: pack[at + i] ?? 0, next: value, why: WHY }]));

const recordRom = (id: number): number => NAME_TABLE_ROM + id * NAME_RECORD_BYTES;

const nameEdits = (pack: Uint8Array): EditPlan => {
  const tables = readPackEntries(pack).filter((entry) => entry.type === CTAS_TYPE_TABLE
    && recordRom(JETS_ITEM_ID) >= entry.id && recordRom(JETS_ITEM_ID) + NAME_RECORD_BYTES <= entry.id + entry.length
    && recordRom(ICON_SOURCE_ITEM_ID) >= entry.id);
  if (tables.length === 0) return { edits: [], failed: [`${WHY}: item name table not in the pack`] };
  const edits = tables.flatMap((table) => {
    const icon = pack[table.start + recordRom(ICON_SOURCE_ITEM_ID) - table.id] ?? NAME_SPACE;
    const record = [icon, ...encodeItemName(JETS_ITEM_NAME)];
    return bytesEdit(pack, table.start + recordRom(JETS_ITEM_ID) - table.id, record);
  });
  return { edits, failed: [] };
};

const propEdits = (pack: Uint8Array): EditPlan => {
  const entry = readPackEntries(pack).find((e) => e.type === ITEM_PROP_PACK_TYPE && e.id === ITEM_PROP_PACK_ID);
  if (entry === undefined || entry.length <= JETS_ITEM_ID) return { edits: [], failed: [`${WHY}: item property table not in the pack`] };
  return { edits: bytesEdit(pack, entry.start + JETS_ITEM_ID, [KEY_ITEM_PROP]), failed: [] };
};

const planJetsItemEdits = (pack: Uint8Array): EditPlan => {
  const parts = [nameEdits(pack), propEdits(pack)];
  return { edits: parts.flatMap((part) => part.edits), failed: parts.flatMap((part) => part.failed) };
};

export { planJetsItemEdits };
