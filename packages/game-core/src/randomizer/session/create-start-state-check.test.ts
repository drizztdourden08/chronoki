/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { STANDARD_START } from '../apply/start-state/standard-start.constants';
import { createStartStateCheck } from './create-start-state-check';
import { fakeView } from './memory-view.fake';

const okBytes = (): Record<number, number> => ({
  0x10057: 0x80, 0x100a3: 0x30, 0x100f7: 0x02, 0x100ba: 0x80, 0x0100: 0xf1, 0x0101: 0x01,
});

describe('createStartStateCheck', { tags: ['critical'] }, () => {
  it('reports ok when flags and location match', () => {
    expect(createStartStateCheck(STANDARD_START).read(fakeView(okBytes()))).toContain('read back ok');
  });

  it('lists the flags that are missing and a stuck cleared flag', () => {
    const line = createStartStateCheck(STANDARD_START).read(fakeView({ ...okBytes(), 0x10057: 0x01, 0x10056: 0x01 }));
    expect(line).toContain('MISMATCH');
    expect(line).toContain('0x7f0057&0x80 unset');
    expect(line).toContain('0x7f0056&0x1 still set');
  });

  it('flags a wrong location', () => {
    expect(createStartStateCheck(STANDARD_START).read(fakeView({ ...okBytes(), 0x0100: 0x10 }))).toContain('location');
  });
});
