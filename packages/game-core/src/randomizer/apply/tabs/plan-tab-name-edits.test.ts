/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { encodeItemName } from '../jets/encode-item-name';
import { NAME_RECORD_BYTES, NAME_TABLE_ROM } from '../jets/jets-item.constants';
import { planTabNameEdits } from './plan-tab-name-edits';

const TABLE_ID = 0x0c05cc;
const TABLE_LENGTH = 0x592 + 0xf2 * NAME_RECORD_BYTES;
const NAME_AT = NAME_TABLE_ROM - TABLE_ID;

const le32 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff];

const packOf = (id = TABLE_ID, length = TABLE_LENGTH): Uint8Array => {
  const table = new Array<number>(length).fill(0xef);
  const bytes: number[] = [0x43, 0x54, 0x41, 0x53, ...le32(1), ...le32(1), ...le32(37), ...le32(id), ...le32(28), ...le32(length)];
  return Uint8Array.from([...bytes, ...table]);
};

describe('planTabNameEdits', { tags: ['critical'] }, () => {
  it('writes the amount into the three tab names and keeps each icon byte', () => {
    const pack = packOf();
    const plan = planTabNameEdits(pack, { power: 3, magic: 2, speed: 9 });
    expect(plan.failed).toEqual([]);
    const edited = pack.slice();
    plan.edits.forEach((edit) => {
      expect(pack[edit.at]).toBe(edit.old);
      edited[edit.at] = edit.next;
    });
    const nameOf = (id: number): number[] => Array.from(edited.slice(28 + NAME_AT + id * NAME_RECORD_BYTES + 1, 28 + NAME_AT + (id + 1) * NAME_RECORD_BYTES));
    expect(nameOf(0xcd)).toEqual(encodeItemName('PowerTab 3'));
    expect(nameOf(0xce)).toEqual(encodeItemName('MagicTab 2'));
    expect(nameOf(0xcf)).toEqual(encodeItemName('SpeedTab 9'));
    expect(edited[28 + NAME_AT + 0xcd * NAME_RECORD_BYTES]).toBe(0xef);
  });

  it('refuses a pack without the item name table', () => {
    expect(planTabNameEdits(packOf(0x1000, 0x40), { power: 2, magic: 2, speed: 2 }).failed).toHaveLength(3);
  });
});
