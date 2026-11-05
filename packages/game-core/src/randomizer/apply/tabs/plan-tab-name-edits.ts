/* @layer bridge-wasm @kind logic */
import { CTAS_TYPE_TABLE } from '../../checks/checks.constants';
import { readPackEntries } from '../../checks/read-pack-entries';
import type { PackEntry } from '../../checks/read-pack-entries.type';
import { TAB_ROM_IDS } from '../../world/tabs/tab.constants';
import type { TabAmounts, TabKind } from '../../world/tabs/tab-amounts.type';
import type { EditPlan, PackEdit } from '../apply-seed.type';
import { encodeItemName } from '../jets/encode-item-name';
import { NAME_RECORD_BYTES, NAME_TABLE_ROM } from '../jets/jets-item.constants';
import { TAB_NAME_PREFIX, TAB_NAME_WHY } from './plan-tab-name-edits.constants';

const nameRom = (kind: TabKind): number => NAME_TABLE_ROM + TAB_ROM_IDS[kind] * NAME_RECORD_BYTES + 1;

const coversName = (table: PackEntry, rom: number, length: number): boolean =>
  rom >= table.id && rom + length <= table.id + table.length;

const nameEdits = (pack: Uint8Array, tables: PackEntry[], kind: TabKind, amount: number): EditPlan => {
  const bytes = encodeItemName(`${TAB_NAME_PREFIX[kind]}Tab+${amount}`);
  const rom = nameRom(kind);
  const covering = tables.filter((table) => coversName(table, rom, bytes.length));
  if (covering.length === 0) return { edits: [], failed: [`${TAB_NAME_WHY}: ${kind} tab name not in the pack`] };
  const edits = covering.flatMap((table) => bytes.flatMap((next, i): PackEdit[] => {
    const at = table.start + rom - table.id + i;
    const old = pack[at] ?? 0;
    return old === next ? [] : [{ at, old, next, why: TAB_NAME_WHY }];
  }));
  return { edits, failed: [] };
};

const planTabNameEdits = (pack: Uint8Array, amounts: TabAmounts): EditPlan => {
  const tables = readPackEntries(pack).filter((entry) => entry.type === CTAS_TYPE_TABLE);
  const parts = (Object.keys(TAB_ROM_IDS) as TabKind[]).map((kind) => nameEdits(pack, tables, kind, amounts[kind]));
  return { edits: parts.flatMap((part) => part.edits), failed: parts.flatMap((part) => part.failed) };
};

export { planTabNameEdits };
