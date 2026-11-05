/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { readPackEntries } from '../../checks/read-pack-entries';
import { encodeChangeLocation } from './encode-change-location';
import { encodePoke } from './encode-poke';
import { encodeSetBits } from './encode-set-bits';
import { pointerAt } from './pointer-at';
import { spliceFixture } from './script-splice.fixture';
import type { ScriptSplice } from './script-splice.type';
import { spliceSceneScript } from './splice-scene-script';
import { spliceSceneScripts } from './splice-scene-scripts';

const { CHANGE, POKE, RETURN, buildScript, entryBytes, jumpScene, le32, packOf, splice } = spliceFixture;
const grown = [...encodePoke(0x7e027e, 2, 1), ...encodeChangeLocation(0x1f1, 5, 6)];

describe('spliceSceneScript', () => {
  it('replaces the anchor in a 1-object script, appends the blob and repoints the entry', { tags: ['critical'] }, () => {
    const pack = packOf(buildScript([[...POKE, ...CHANGE, ...RETURN]]));
    const before = Uint8Array.from(pack);
    const result = spliceSceneScript(pack, splice(grown));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(entryBytes(result.bytes, 16, 7)).toEqual(buildScript([[...POKE, ...grown, ...RETURN]]));
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

  it('updates the identical LZ copy with its out-len', { tags: ['critical'] }, () => {
    const result = spliceSceneScript(packOf(buildScript(jumpScene)), splice(grown));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const script = entryBytes(result.bytes, 16, 7);
    const lz = entryBytes(result.bytes, 36, 0x400000);
    expect(lz.slice(12)).toEqual(script);
    expect(lz.slice(0, 4)).toEqual(le32(script.length));
    expect(lz.slice(4, 12)).toEqual([...le32(11), ...le32(22)]);
  });
});

describe('spliceSceneScript pointers and jumps', () => {
  const pack = packOf(buildScript(jumpScene));
  const longer = [...encodeSetBits(0x7f0057, 0x80), ...grown];

  it('shifts later object pointers when the replacement is longer and shorter', { tags: ['critical'] }, () => {
    [longer, [0x00, 0x00]].forEach((block) => {
      const result = spliceSceneScript(pack, splice(block));
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      const raw = Uint8Array.from(entryBytes(result.bytes, 16, 7));
      const delta = block.length - CHANGE.length;
      expect(pointerAt(raw, 16)).toBe(96 + 2 + CHANGE.length + 3 + delta);
      expect(pointerAt(raw, 32)).toBe(96 + 2 + CHANGE.length + 3 + 6 + delta);
      expect(raw.length).toBe(buildScript(jumpScene).length + delta);
    });
  });

  it('fixes a forward jump over the splice and a backward jump across it', { tags: ['critical'] }, () => {
    [grown, [0x00, 0x00]].forEach((block) => {
      const result = spliceSceneScript(pack, splice(block));
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      const body = [0x10, block.length + 1, ...block, 0x11, block.length + 3, ...RETURN];
      const expected = buildScript([body, jumpScene[1] ?? [], jumpScene[2] ?? []]);
      expect(entryBytes(result.bytes, 16, 7)).toEqual(expected);
    });
  });
});

describe('spliceSceneScripts', () => {
  it('refuses a missing anchor, a non-unique anchor and a missing scene', { tags: ['critical'] }, () => {
    const none = packOf(buildScript([[...POKE, ...RETURN]]));
    const twice = packOf(buildScript([[...CHANGE, ...CHANGE, ...RETURN]]));
    expect(spliceSceneScript(none, splice([0, 0]))).toEqual({ ok: false, failed: ['test: anchor not found'] });
    expect(spliceSceneScript(twice, splice([0, 0]))).toEqual({ ok: false, failed: ['test: anchor matches 2 ops'] });
    expect(spliceSceneScript(none, { ...splice([0]), scene: 5 }).ok).toBe(false);
  });

  it('fails the whole set and never changes the input', { tags: ['critical'] }, () => {
    const pack = packOf(buildScript(jumpScene));
    const before = Uint8Array.from(pack);
    const bad: ScriptSplice = { ...splice([0]), anchor: () => false, why: 'bad' };
    expect(spliceSceneScripts(pack, [splice([0, 0]), bad])).toEqual({ ok: false, failed: ['bad: anchor not found'] });
    expect(pack).toEqual(before);
    expect(spliceSceneScripts(pack, [splice([0, 0])]).ok).toBe(true);
  });
});
