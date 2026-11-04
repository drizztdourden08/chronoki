/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { applySeedToPack } from './apply-seed-to-pack';

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

const script = (): number[] => [1, ...le16(32), ...le16(36), ...new Array<number>(28).fill(0), 0xca, 0x0b, 0x00, 0x00];

const syntheticPack = (shadowItem: number | null = null): Uint8Array => {
  const pointers: number[] = [];
  for (let i = 0; i < 513; i += 1) pointers.push(...le16(i <= 5 ? 0x100 : 0x108));
  const records = [...le16(0x0403), ...le16(0x0a), ...le16(0x0505), ...le16(0x0020)];
  const header = [0, 0, 0, 0, 0, 0, 0, 0, ...le16(7), 0, 0, 0, 0];
  const shadow = shadowItem === null ? [] : [{ type: 37, id: 0x350100, data: [...le16(0x0403), ...le16(shadowItem)] }];
  return buildPack([
    { type: 37, id: 0x35f000, data: pointers },
    { type: 37, id: 0x350100, data: records },
    { type: 3, id: 0x12, data: header },
    { type: 16, id: 7, data: script() },
    { type: 36, id: 0x400000, data: [...new Array<number>(12).fill(0), ...script()] },
    ...shadow,
  ]);
};

const find = (hay: Uint8Array, needle: number[]): number => hay.findIndex((_, i) => needle.every((n, k) => hay[i + k] === n));

describe('applySeedToPack', () => {
  it('swaps a chest item and a gift operand, including the byte-identical LZ copy', { tags: ['critical'] }, () => {
    const pack = syntheticPack();
    const result = applySeedToPack(pack, { 'chest-005-0': 0x42, 'gift-012-o0': 0x77 });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const at = find(result.bytes, [...le16(0x0403), 0x42, 0x00]);
    expect(at).toBeGreaterThan(0);
    const gifts = result.bytes.filter((b, i) => b === 0x77 && result.bytes[i - 1] === 0xca).length;
    expect(gifts).toBe(2);
    expect(result.bytes.length).toBe(pack.length);
  });

  it('refuses everything when one target does not match its vanilla item, and changes nothing', { tags: ['critical'] }, () => {
    const pack = syntheticPack();
    const stored = syntheticPack(0x0c);
    const copy = Uint8Array.from(stored);
    const result = applySeedToPack(stored, { 'chest-005-0': 0x42, 'gift-012-o0': 0x77 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.failed).toContain('chest-005-0');
    expect(stored).toEqual(copy);
    expect(applySeedToPack(pack, { 'chest-005-0': 0x42, 'chest-999-0': 0x01 })).toEqual({ ok: false, failed: ['chest-999-0'] });
  });

  it('never mutates the input buffer', { tags: ['critical'] }, () => {
    const pack = syntheticPack();
    const before = Uint8Array.from(pack);
    const result = applySeedToPack(pack, { 'chest-005-0': 0x42 });
    expect(result.ok && result.bytes).not.toBe(pack);
    expect(pack).toEqual(before);
  });
});
