/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { deriveGiftChecks } from './derive-gift-checks';

const le32 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff];
const le16 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff];

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

const syntheticScript = (): number[] => {
  const objectHeader = [...le16(32), ...le16(38), ...new Array<number>(28).fill(0)];
  const body = [0xca, 0x0a, 0x65, 0x01, 0x10, 0x00, 0x0a, 0x00, 0x00, 0xca, 0xd7, 0x00];
  return [1, ...objectHeader, ...body];
};

describe('deriveGiftChecks', () => {
  it('finds each add-item op by walking op lengths and records its operand position', { tags: ['critical'] }, () => {
    const header = [0, 0, 0, 0, 0, 0, 0, 0, ...le16(7), 0, 0, 0, 0];
    const pack = buildPack([
      { type: 3, id: 0x12, data: header },
      { type: 16, id: 7, data: syntheticScript() },
    ]);
    const checks = deriveGiftChecks(pack);
    expect(checks.map((c) => c.id)).toEqual(['gift-012-o0-0', 'gift-012-o0-1']);
    expect(checks[0]).toMatchObject({ kind: 'gift', locationId: 0x12, vanillaItem: 0x0a, scriptId: 7, patchAt: [34] });
    expect(checks[1]).toMatchObject({ vanillaItem: 0xd7, patchAt: [34 + 9] });
    expect(checks[0]?.probe).toBeUndefined();
  });

  it('collapses repeated same-item ops in one object into one check with every operand', { tags: ['critical'] }, () => {
    const header = [0, 0, 0, 0, 0, 0, 0, 0, ...le16(7), 0, 0, 0, 0];
    const objectHeader = [...le16(32), ...le16(36), ...new Array<number>(28).fill(0)];
    const script = [1, ...objectHeader, 0xca, 0x0a, 0xca, 0x0a, 0xca, 0x0a, 0x00, 0x00];
    const pack = buildPack([{ type: 3, id: 0x12, data: header }, { type: 16, id: 7, data: script }]);
    const checks = deriveGiftChecks(pack);
    expect(checks).toHaveLength(1);
    expect(checks[0]).toMatchObject({ id: 'gift-012-o0', vanillaItem: 0x0a, patchAt: [34, 36, 38] });
  });

  it('emits one check per distinct item in an object and one per object', { tags: ['critical'] }, () => {
    const header = [0, 0, 0, 0, 0, 0, 0, 0, ...le16(7), 0, 0, 0, 0];
    const pad = new Array<number>(30).fill(0);
    const objects = [...le16(64), ...pad, ...le16(68), ...pad];
    const body = [0xca, 0x0a, 0xca, 0x0b, 0xca, 0x0c, 0x00, 0x00];
    const pack = buildPack([{ type: 3, id: 0x12, data: header }, { type: 16, id: 7, data: [2, ...objects, ...body] }]);
    const checks = deriveGiftChecks(pack);
    expect(checks.map((c) => c.id)).toEqual(['gift-012-o0-0', 'gift-012-o0-1', 'gift-012-o1']);
    expect(checks.map((c) => c.patchAt)).toEqual([[66], [68], [70]]);
  });

  it('returns nothing for a buffer that is not a pack', { tags: ['critical'] }, () => {
    expect(deriveGiftChecks(new Uint8Array(64))).toEqual([]);
  });
});
