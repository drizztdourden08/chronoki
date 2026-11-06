/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { STANDARD_START } from '../apply/start-state/standard-start.constants';
import { createStartStateCheck } from './create-start-state-check';
import { fakeView } from './memory-view.fake';

const okBytes = (): Record<number, number> => ({
  0x10057: 0x80, 0x100a3: 0x30, 0x100f7: 0x02, 0x100ba: 0x80, 0x0100: 0xf1, 0x0101: 0x01,
  0x2980: 0, 0x2981: 1, 0x2982: 0x80, 0x2983: 0x80, 0x2984: 0x80, 0x2985: 0x80, 0x2986: 0x80, 0x2987: 0x80, 0x2988: 0x80, 0x29af: 0xc0,
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

  it('is not settled on the New Game edge (location 0) nor on the intro world, only once the warp lands', () => {
    const check = createStartStateCheck(STANDARD_START);
    expect(check.settled(fakeView({ ...okBytes(), 0x0100: 0x00, 0x0101: 0x00 }))).toBe(false);
    expect(check.settled(fakeView({ ...okBytes(), 0x0100: 0xf0, 0x0101: 0x01 }))).toBe(false);
    expect(check.settled(fakeView(okBytes()))).toBe(true);
    expect(check.underway(fakeView({ ...okBytes(), 0x0100: 0x00, 0x0101: 0x00 }))).toBe(false);
    expect(check.underway(fakeView({ ...okBytes(), 0x0100: 0xf0, 0x0101: 0x01 }))).toBe(true);
  });

  it('matches only when nothing is off', () => {
    const check = createStartStateCheck(STANDARD_START);
    expect(check.matches(fakeView(okBytes()))).toBe(true);
    expect(check.matches(fakeView({ ...okBytes(), 0x10057: 0x00 }))).toBe(false);
  });

  it('flags a wrong roster byte and joined mask', () => {
    const line = createStartStateCheck(STANDARD_START).read(fakeView({ ...okBytes(), 0x2981: 0x80, 0x29af: 0x80 }));
    expect(line).toContain('party 0x7e2981=0x80 expected 0x1');
    expect(line).toContain('party 0x7e29af=0x80 expected 0xc0');
  });
});
