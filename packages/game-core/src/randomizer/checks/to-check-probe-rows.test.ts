/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { createCtMemoryView } from '../memory/create-ct-memory-view';
import type { CheckDef } from './check.type';
import { toCheckProbeRows } from './to-check-probe-rows';

const chest = (id: string, offset: number, mask: number, compare: 'set' | 'clear'): CheckDef => ({
  id, kind: 'chest', locationId: 1, vanillaItem: 1, probe: { region: 'wram', offset, mask, compare },
});

describe('toCheckProbeRows', () => {
  it('maps a set probe to a mask row and skips probe-less checks', { tags: ['critical'] }, () => {
    const gift: CheckDef = { id: 'gift-1', kind: 'gift', locationId: 2, vanillaItem: 3 };
    const rows = toCheckProbeRows([chest('a', 0x10001, 0x04, 'set'), gift]);
    expect(rows).toEqual([{ key: 'a', probe: { region: 'wram', offset: 0x10001, mask: 0x04 } }]);
  });

  it('maps a clear probe to a custom row that is true when the bit is clear', { tags: ['critical'] }, () => {
    const heap = new Uint8Array(0x20000);
    const probe = toCheckProbeRows([chest('b', 0x10002, 0x80, 'clear')])[0]?.probe;
    if (!probe || !('custom' in probe)) throw new Error('expected a custom probe');
    expect(probe.custom(createCtMemoryView(heap, 0))).toBe(true);
    heap[0x10002] = 0x80;
    expect(probe.custom(createCtMemoryView(heap, 0))).toBe(false);
  });
});
