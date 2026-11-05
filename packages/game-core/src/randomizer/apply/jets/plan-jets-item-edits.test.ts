/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { encodeItemName } from './encode-item-name';
import { NAME_RECORD_BYTES, NAME_TABLE_ROM } from './jets-item.constants';
import { planJetsItemEdits } from './plan-jets-item-edits';

const TABLE_ID = 0x0c05cc;
const TABLE_LENGTH = 0x592 + 0xf2 * NAME_RECORD_BYTES;
const NAME_AT = NAME_TABLE_ROM - TABLE_ID;
const ICON = 0x21;

const le32 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff];

const packOf = (withProps = true): Uint8Array => {
  const table = new Array<number>(TABLE_LENGTH).fill(0xff);
  table[NAME_AT + 0xd6 * NAME_RECORD_BYTES] = ICON;
  const props = new Array<number>(0x100).fill(0x0c);
  const blobs = [{ type: 37, id: TABLE_ID, data: table }, ...(withProps ? [{ type: 65, id: 135, data: props }] : [])];
  const bytes: number[] = [0x43, 0x54, 0x41, 0x53, ...le32(1), ...le32(blobs.length)];
  let at = 12 + blobs.length * 16;
  blobs.forEach((blob) => {
    bytes.push(...le32(blob.type), ...le32(blob.id), ...le32(at), ...le32(blob.data.length));
    at += blob.data.length;
  });
  blobs.forEach((blob) => bytes.push(...blob.data));
  return Uint8Array.from(bytes);
};

describe('planJetsItemEdits', { tags: ['critical'] }, () => {
  it('encodes the name with the game letters', () => {
    expect(encodeItemName('Jets')).toEqual([0xa9, 0xbe, 0xcd, 0xcc]);
  });

  it('renames item 0xEA with the Pendant icon and makes it a key item', () => {
    const pack = packOf();
    const plan = planJetsItemEdits(pack);
    expect(plan.failed).toEqual([]);
    plan.edits.forEach((edit) => expect(pack[edit.at]).toBe(edit.old));
    const edited = pack.slice();
    plan.edits.forEach((edit) => {
      edited[edit.at] = edit.next;
    });
    const nameAt = 12 + 2 * 16 + NAME_AT + 0xea * NAME_RECORD_BYTES;
    expect([...edited.slice(nameAt, nameAt + NAME_RECORD_BYTES)]).toEqual([ICON, ...encodeItemName('JetsOfTime')]);
    const propAt = 12 + 2 * 16 + TABLE_LENGTH + 0xea;
    expect(edited[propAt]).toBe(0x1c);
    expect(edited[propAt - 1]).toBe(0x0c);
  });

  it('reports a pack without the tables instead of editing', () => {
    expect(planJetsItemEdits(packOf(false)).failed).toHaveLength(1);
    expect(planJetsItemEdits(Uint8Array.of(0, 0, 0, 0)).failed).toHaveLength(2);
  });
});
