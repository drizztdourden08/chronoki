/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { spliceFixture } from '../script/script-splice.fixture';
import { spliceSceneScripts } from '../script/splice-scene-scripts';
import { planStoryWindowSplices } from './plan-story-window-splices';

const { entryBytes, le16, le32 } = spliceFixture;
const SCRIPT_ID = 7;

const scriptOf = (objects: number, fn: number, body: number[]): number[] => {
  const header = objects * 32;
  const pointers = Array.from({ length: objects * 16 }, (_, k) => le16(k === fn ? header + 1 : header)).flat();
  return [objects, ...pointers, 0x00, ...body];
};

const packOf = (scene: number, script: number[]): Uint8Array => {
  const blobs = [
    { type: 3, id: scene, data: [0, 0, 0, 0, 0, 0, 0, 0, ...le16(SCRIPT_ID), 0, 0] },
    { type: 16, id: SCRIPT_ID, data: script },
  ];
  const bytes: number[] = [0x43, 0x54, 0x41, 0x53, ...le32(1), ...le32(blobs.length)];
  let at = 12 + blobs.length * 16;
  blobs.forEach((b) => {
    bytes.push(...le32(b.type), ...le32(b.id), ...le32(at), ...le32(b.data.length));
    at += b.data.length;
  });
  blobs.forEach((b) => bytes.push(...b.data));
  return Uint8Array.from(bytes);
};

const REPTITE_BODY = [0x18, 0x7c, 0x03, 0x10, 0x04, 0x0a, 0x10, 0xb2, 0xca, 0xd7, 0x00];
const FILLER = new Array<number>(193).fill(0x00);
const ARRIS_BODY = [0x18, 0x36, 0x04, 0x00, 0x10, 0xc7, 0x18, 0x37, 0xc4, 0xca, 0xd5, ...FILLER, 0x00];
const ARRIS_FN = 15 * 16 + 2;

const splicedScript = (pack: Uint8Array, placement: Record<string, number>): number[] => {
  const result = spliceSceneScripts(pack, planStoryWindowSplices(placement));
  expect(result).toMatchObject({ ok: true });
  return result.ok ? entryBytes(result.bytes, 16, SCRIPT_ID) : [];
};

describe('planStoryWindowSplices', { tags: ['critical'] }, () => {
  it('plans nothing without a placed key item, so vanilla stays byte-identical', () => {
    expect(planStoryWindowSplices({})).toEqual([]);
    expect(planStoryWindowSplices({ 'gift-121-o0': 0xd5, 'gift-0d6-o15': 0x01 })).toEqual([]);
  });

  it('gives the Reptite Lair key item when the story is already past 0x7C and it is not held', () => {
    const expected = [0x18, 0x7c, 0x03, 0x10, 0x0b, 0xc9, 0xd8, 0x03, 0x10, 0x03, 0xca, 0xd8, 0x0a, 0x10, 0xb2, 0xca, 0xd7, 0x00];
    expect(splicedScript(packOf(0x121, scriptOf(1, 0, REPTITE_BODY)), { 'gift-121-o0': 0xd8 })).toEqual(scriptOf(1, 0, expected));
  });

  it('gives the Arris Dome key item on the story 0x37 skip path and keeps the 0x36 event path', () => {
    const expected = [
      0x18, 0x36, 0x04, 0x00, 0x10, 0xd1, 0x18, 0x37, 0x03, 0x10, 0x09, 0xc9, 0xe2, 0x03, 0x10, 0x03, 0xca, 0xe2, 0x00,
      0xca, 0xd5, ...FILLER, 0x00,
    ];
    const pack = packOf(0x0d6, scriptOf(16, ARRIS_FN, ARRIS_BODY));
    expect(splicedScript(pack, { 'gift-0d6-o15': 0xe2 })).toEqual(scriptOf(16, ARRIS_FN, expected));
  });

  it('treats the Jets of Time as a key item', () => {
    expect(planStoryWindowSplices({ 'gift-0d6-o15': 0xea })).toHaveLength(1);
  });

  it('fails the seed when the story test is not where it is expected (another ROM)', () => {
    const pack = packOf(0x0d6, scriptOf(16, ARRIS_FN, ARRIS_BODY.map((b, i) => (i === 7 ? 0x38 : b))));
    const result = spliceSceneScripts(pack, planStoryWindowSplices({ 'gift-0d6-o15': 0xe2 }));
    expect(result).toEqual({ ok: false, failed: ['story-window-arris-dome: anchor not found'] });
  });
});
