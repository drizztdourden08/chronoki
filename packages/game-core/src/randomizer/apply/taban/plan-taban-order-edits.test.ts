/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import type { CheckDef } from '../../checks/check.type';
import { planTabanOrderEdits } from './plan-taban-order-edits';

const le32 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff];

type Blob = { type: number; id: number; data: number[] };

const buildPack = (blobs: Blob[]): Uint8Array => {
  const bytes: number[] = [0x43, 0x54, 0x41, 0x53, ...le32(1), ...le32(blobs.length)];
  let at = 12 + blobs.length * 16;
  blobs.forEach((b) => {
    bytes.push(...le32(b.type), ...le32(b.id), ...le32(at), ...le32(b.data.length));
    at += b.data.length;
  });
  blobs.forEach((b) => bytes.push(...b.data));
  return Uint8Array.from(bytes);
};

const FIRST_OPERAND = 48;
const LAST_OPERAND = 64;

const tabanScript = (firstThreshold = 0xae, lastThreshold = 0x51): number[] => {
  const raw = [1, ...new Array<number>(80).fill(0)];
  raw.splice(33, 5, 0x16, 0x00, firstThreshold, 0x04, 0x14);
  raw[FIRST_OPERAND - 1] = 0xca;
  raw[FIRST_OPERAND] = 0x7a;
  raw.splice(49, 5, 0x16, 0x00, lastThreshold, 0x04, 0x14);
  raw[LAST_OPERAND - 1] = 0xca;
  raw[LAST_OPERAND] = 0x79;
  return raw;
};

const GIFTS: CheckDef[] = [
  { id: 'gift-004-o8-0', kind: 'gift', locationId: 4, vanillaItem: 0x7a, scriptId: 26, patchAt: [FIRST_OPERAND] },
  { id: 'gift-004-o8-2', kind: 'gift', locationId: 4, vanillaItem: 0x79, scriptId: 26, patchAt: [LAST_OPERAND] },
];

const packOf = (script: number[], lzCopy = false): Uint8Array => buildPack([
  { type: 16, id: 26, data: script },
  ...(lzCopy ? [{ type: 36, id: 0x400000, data: [...new Array<number>(12).fill(0), ...script] }] : []),
]);

const scriptStart = (pack: Uint8Array): number => (pack[20] ?? 0) | ((pack[21] ?? 0) << 8);

describe('planTabanOrderEdits', { tags: ['critical'] }, () => {
  it('moves the placed first gift to the 0x51 test and the Vest gift to the 0xAE test', () => {
    const pack = packOf(tabanScript());
    const base = scriptStart(pack);
    const plan = planTabanOrderEdits(pack, GIFTS, { 'gift-004-o8-0': 0xd7 });
    expect(plan.failed).toEqual([]);
    expect(plan.edits).toEqual([
      { at: base + FIRST_OPERAND - 0x0d, old: 0xae, next: 0x51, why: 'taban-order' },
      { at: base + LAST_OPERAND - 0x0d, old: 0x51, next: 0xae, why: 'taban-order' },
    ]);
  });

  it('edits every identical LZ copy of the script too', () => {
    const plan = planTabanOrderEdits(packOf(tabanScript(), true), GIFTS, { 'gift-004-o8-0': 0xd7 });
    expect(plan.edits).toHaveLength(4);
  });

  it('plans nothing when Taban is not placed, so vanilla stays byte-identical', () => {
    expect(planTabanOrderEdits(packOf(tabanScript()), GIFTS, {})).toEqual({ edits: [], failed: [] });
    expect(planTabanOrderEdits(packOf(tabanScript()), GIFTS, { 'gift-004-o8-2': 0xd7 })).toEqual({ edits: [], failed: [] });
  });

  it('fails the seed, not editing a script whose storyline tests differ (another ROM)', () => {
    const plan = planTabanOrderEdits(packOf(tabanScript(0xad, 0x51)), GIFTS, { 'gift-004-o8-0': 0xd7 });
    expect(plan).toEqual({ edits: [], failed: ['gift-004-o8-0'] });
  });

  it('fails when the Vest gift is missing', () => {
    const plan = planTabanOrderEdits(packOf(tabanScript()), GIFTS.slice(0, 1), { 'gift-004-o8-0': 0xd7 });
    expect(plan.failed).toEqual(['gift-004-o8-0']);
  });
});
