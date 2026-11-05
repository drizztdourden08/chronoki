/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { STANDARD_START } from '../../apply/start-state/standard-start.constants';
import { comparePackToPlacement } from './compare-pack-to-placement';
import { readbackFixture } from './readback-pack.fixture';

const { fixturePlacement, writtenPack } = readbackFixture;
const OPTIONS = { startState: STANDARD_START };

const find = (hay: Uint8Array, needle: number[]): number => hay.findIndex((_, i) => needle.every((n, k) => hay[i + k] === n));

describe('comparePackToPlacement', () => {
  it('finds no mismatch in a pack the real writers produced', { tags: ['critical'] }, () => {
    expect(comparePackToPlacement(writtenPack(), fixturePlacement(), OPTIONS)).toEqual([]);
  });

  it('reports exactly a flipped chest byte and a flipped roster byte', { tags: ['critical'] }, () => {
    const pack = writtenPack();
    const chest = find(pack, [0x03, 0x04, 0x42, 0x00]) + 2;
    const roster = find(pack, [0x4a, 0x81, 0x29, 0x7e, 0x01]) + 4;
    pack[chest] = 0x43;
    pack[roster] = 0x02;
    const found = comparePackToPlacement(pack, fixturePlacement(), OPTIONS);
    expect(found).toEqual([
      { kind: 'chest', location: 'chest-005-0', expected: 0x42, actual: 0x43, address: 0x350102 },
      { kind: 'roster', location: 'slot-1', expected: 1, actual: 2, address: 0x7e2981 },
    ]);
  });

  it('reports a gift operand that was not written', { tags: ['critical'] }, () => {
    const pack = writtenPack();
    pack.forEach((byte, i) => {
      if (byte === 0x77 && pack[i - 1] === 0xca) pack[i] = 0x0b;
    });
    const found = comparePackToPlacement(pack, fixturePlacement(), OPTIONS);
    expect(found.map((m) => [m.kind, m.location, m.expected, m.actual])).toEqual([['gift', 'gift-012-o0', 0x77, 0x0b]]);
  });

  it('reports the joined mask and a missing start block', { tags: ['critical'] }, () => {
    const pack = writtenPack();
    pack[find(pack, [0x4a, 0xaf, 0x29, 0x7e, 0xc0]) + 4] = 0x40;
    const joined = comparePackToPlacement(pack, fixturePlacement(), OPTIONS);
    expect(joined.map((m) => [m.kind, m.expected, m.actual])).toEqual([['joined', 0xc0, 0x40]]);
    const bare = comparePackToPlacement(pack.slice(0, 12), fixturePlacement(), OPTIONS);
    expect(bare.some((m) => m.kind === 'start-block')).toBe(true);
  });
});
