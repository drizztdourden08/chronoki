/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { readPackEntries } from '../../checks/read-pack-entries';
import { changeLocationTarget, encodeChangeLocation, encodePoke, encodeSetBits, isChangeLocation } from './encode-script-ops';
import type { ScriptSplice } from './script-splice.type';
import { spliceSceneScript, spliceSceneScripts } from './splice-scene-script';

const le32 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff];
const le16 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff];
const POKE = [0x4a, 0x00, 0x00, 0x7e, 0x01];
const CHANGE = [0xe0, 0xf0, 0x01, 0x3f, 0x38];
const RETURN = [0x00];

const buildScript = (bodies: number[][]): number[] => {
  const header = bodies.length * 32;
  const pointers: number[] = [];
  let at = header;
  bodies.forEach((body) => {
    pointers.push(...le16(at), ...new Array<number>(30).fill(0));
    at += body.length;
  });
  return [bodies.length, ...pointers, ...bodies.flat()];
};

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

const packOf = (script: number[]): Uint8Array =>
  buildPack([
    { type: 3, id: 0, data: [0, 0, 0, 0, 0, 0, 0, 0, ...le16(7), 0, 0] },
    { type: 16, id: 7, data: script },
    { type: 16, id: 9, data: buildScript([[...POKE, ...RETURN]]) },
    { type: 36, id: 0x400000, data: [...le32(script.length), ...le32(11), ...le32(22), ...script] },
  ]);

const entryBytes = (pack: Uint8Array, type: number, id: number): number[] => {
  const e = readPackEntries(pack).find((x) => x.type === type && x.id === id);
  return e ? [...pack.subarray(e.start, e.start + e.length)] : [];
};

const splice = (replace: number[]): ScriptSplice => ({
  scene: 0,
  anchor: (op) => isChangeLocation(op) && changeLocationTarget(op) === 0x1f0,
  replace: Uint8Array.from(replace),
  why: 'test',
});

const jumpScene = [
  [0x10, 6, ...CHANGE, 0x11, 8, ...RETURN],
  [...POKE, ...RETURN],
  [...RETURN],
];

describe('spliceSceneScript', () => {
  it('replaces the anchor in a 1-object script, appends the blob and repoints the entry', { tags: ['critical'] }, () => {
    const script = buildScript([[...POKE, ...CHANGE, ...RETURN]]);
    const pack = packOf(script);
    const before = Uint8Array.from(pack);
    const block = [...encodePoke(0x7e027e, 2, 1), ...encodeChangeLocation(0x1f1, 5, 6)];
    const result = spliceSceneScript(pack, splice(block));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(entryBytes(result.bytes, 16, 7)).toEqual(buildScript([[...POKE, ...block, ...RETURN]]));
    expect(result.bytes.length).toBeGreaterThan(pack.length);
    expect(pack).toEqual(before);
  });

  it('keeps every old byte and leaves other entries alone', { tags: ['critical'] }, () => {
    const script = buildScript([[...POKE, ...CHANGE, ...RETURN]]);
    const pack = packOf(script);
    const result = spliceSceneScript(pack, splice([...encodePoke(0x7e027e, 2, 1)]));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const oldStart = readPackEntries(pack).find((e) => e.type === 16 && e.id === 7)?.start ?? 0;
    expect([...result.bytes.subarray(oldStart, oldStart + script.length)]).toEqual(script);
    expect(entryBytes(result.bytes, 16, 9)).toEqual(entryBytes(pack, 16, 9));
  });

  it('shifts later object pointers when the replacement is longer and shorter', { tags: ['critical'] }, () => {
    const pack = packOf(buildScript(jumpScene));
    const longer = [...encodeSetBits(0x7f0057, 0x80), ...encodePoke(0x7e027e, 2, 1), ...encodeChangeLocation(0x1f1, 5, 6)];
    const shorter = [0x00, 0x00];
    [longer, shorter].forEach((block) => {
      const result = spliceSceneScript(pack, splice(block));
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      const raw = entryBytes(result.bytes, 16, 7);
      const delta = block.length - CHANGE.length;
      expect(raw[1 + 32] | (raw[2 + 32] << 8)).toBe(96 + 2 + CHANGE.length + 3 + delta);
      expect(raw[1 + 64] | (raw[2 + 64] << 8)).toBe(96 + 2 + CHANGE.length + 3 + 6 + delta);
      expect(raw.length).toBe(buildScript(jumpScene).length + delta);
    });
  });

  it('fixes a forward jump over the splice and a backward jump across it', { tags: ['critical'] }, () => {
    const pack = packOf(buildScript(jumpScene));
    const longer = [...encodePoke(0x7e027e, 2, 1), ...encodeChangeLocation(0x1f1, 5, 6)];
    const shorter = [0x00, 0x00];
    [longer, shorter].forEach((block) => {
      const result = spliceSceneScript(pack, splice(block));
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      const expected = buildScript([
        [0x10, block.length + 1, ...block, 0x11, block.length + 3, ...RETURN],
        jumpScene[1] ?? [],
        jumpScene[2] ?? [],
      ]);
      expect(entryBytes(result.bytes, 16, 7)).toEqual(expected);
    });
  });

  it('updates the identical LZ copy with its out-len', { tags: ['critical'] }, () => {
    const pack = packOf(buildScript(jumpScene));
    const block = [...encodePoke(0x7e027e, 2, 1), ...encodeChangeLocation(0x1f1, 5, 6)];
    const result = spliceSceneScript(pack, splice(block));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const script = entryBytes(result.bytes, 16, 7);
    const lz = entryBytes(result.bytes, 36, 0x400000);
    expect(lz.slice(12)).toEqual(script);
    expect(lz.slice(0, 4)).toEqual(le32(script.length));
    expect(lz.slice(4, 12)).toEqual([...le32(11), ...le32(22)]);
  });

  it('refuses a missing anchor, a non-unique anchor and a missing scene', { tags: ['critical'] }, () => {
    const none = packOf(buildScript([[...POKE, ...RETURN]]));
    const twice = packOf(buildScript([[...CHANGE, ...CHANGE, ...RETURN]]));
    expect(spliceSceneScript(none, splice([0, 0]))).toEqual({ ok: false, failed: ['test: anchor not found'] });
    expect(spliceSceneScript(twice, splice([0, 0]))).toEqual({ ok: false, failed: ['test: anchor matches 2 ops'] });
    expect(spliceSceneScript(none, { ...splice([0]), scene: 5 }).ok).toBe(false);
  });

  it('spliceSceneScripts fails the whole set and never changes the input', { tags: ['critical'] }, () => {
    const pack = packOf(buildScript(jumpScene));
    const before = Uint8Array.from(pack);
    const bad: ScriptSplice = { ...splice([0]), anchor: () => false, why: 'bad' };
    expect(spliceSceneScripts(pack, [splice([0, 0]), bad])).toEqual({ ok: false, failed: ['bad: anchor not found'] });
    expect(pack).toEqual(before);
    expect(spliceSceneScripts(pack, [splice([0, 0])]).ok).toBe(true);
  });
});
