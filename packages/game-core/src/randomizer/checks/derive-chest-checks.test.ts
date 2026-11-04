/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { deriveChestChecks } from './derive-chest-checks';

const T_TABLE = 37;
const le32 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff];
const le16 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff];

const buildPack = (tables: { id: number; data: number[] }[]): Uint8Array => {
  const head = 12 + tables.length * 16;
  const bytes: number[] = [0x43, 0x54, 0x41, 0x53, ...le32(1), ...le32(tables.length)];
  let at = head;
  tables.forEach((t) => {
    bytes.push(...le32(T_TABLE), ...le32(t.id), ...le32(at), ...le32(t.data.length));
    at += t.data.length;
  });
  tables.forEach((t) => bytes.push(...t.data));
  return Uint8Array.from(bytes);
};

const syntheticPack = (): Uint8Array => {
  const pointers: number[] = [];
  for (let i = 0; i < 513; i += 1) pointers.push(...le16(i <= 5 ? 0x100 : i === 6 ? 0x10c : 0x110));
  const records = [
    ...le16(0x0403), ...le16(0x000a),
    ...le16(0x0505), ...le16(0x8010),
    ...le16(0x0607), ...le16(0x01d7),
    ...le16(0x0000), ...le16(0x0005),
  ];
  return buildPack([{ id: 0x35f000, data: pointers }, { id: 0x350100, data: records }]);
};

describe('deriveChestChecks', () => {
  it('keys item chests by location and record, skips gold and aliases', { tags: ['critical'] }, () => {
    const checks = deriveChestChecks(syntheticPack());
    expect(checks.map((c) => c.id)).toEqual(['chest-005-0', 'chest-005-2']);
    expect(checks[0]).toMatchObject({ kind: 'chest', locationId: 5, tile: { x: 3, y: 4 }, vanillaItem: 0x0a });
    expect(checks[0].probe).toEqual({ region: 'wram', offset: 0x10001, mask: 1, compare: 'set' });
    expect(checks[1].vanillaItem).toBe(0x1d7);
    expect(checks[1].probe).toEqual({ region: 'wram', offset: 0x10001, mask: 4, compare: 'set' });
  });

  it('returns nothing for a buffer that is not a pack', { tags: ['critical'] }, () => {
    expect(deriveChestChecks(new Uint8Array(64))).toEqual([]);
  });
});
