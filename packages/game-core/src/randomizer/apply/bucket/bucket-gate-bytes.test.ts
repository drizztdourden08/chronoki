/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { planSeedSplices } from '../plan-seed-splices';
import { bucketGateBytes } from './bucket-gate-bytes';

describe('bucketGateBytes', { tags: ['critical'] }, () => {
  it('tests the gate byte and jumps to the shifted open branch', () => {
    expect([...bucketGateBytes()]).toEqual([0x16, 0xfc, 0x00, 0x80, 0x1b, 0x18, 0x4d, 0x18]);
  });

  it('adds one splice only with the bucket list on', () => {
    const party = ['crono'] as const;
    const off = planSeedSplices({}, party);
    const on = planSeedSplices({ bucketList: true }, party);
    expect(on).toHaveLength(off.length + 1);
    expect(on.at(-1)?.why).toBe('bucket-gate');
  });
});
