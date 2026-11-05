/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { createStartMagicGrant } from './create-start-magic-grant';
import { fakeView } from './memory-view.fake';

const fixture = (accept = true, initial: Record<number, number> = {}) => {
  const store: Record<number, number> = { ...initial };
  const view = fakeView(store);
  const ram = {
    get: (at: number): number | undefined => store[at],
    set: (at: number, value: number): void => {
      store[at] = value;
    },
    size: (): number => Object.keys(store).length,
  };
  const write = (offset: number, bytes: Uint8Array): boolean => {
    if (!accept) return false;
    bytes.forEach((b, i) => ram.set(offset + i, b));
    return true;
  };
  return { ram, view, write };
};

describe('createStartMagicGrant', { tags: ['critical'] }, () => {
  it('writes nothing before the game starts', () => {
    const { ram, view, write } = fixture();
    expect(createStartMagicGrant(write).observe(false, view)).toBe(false);
    expect(ram.size()).toBe(0);
  });

  it('writes the gate, levels, tech bits and TP words once started', () => {
    const { ram, view, write } = fixture();
    expect(createStartMagicGrant(write).observe(true, view)).toBe(true);
    expect(ram.get(0x101e0)).toBe(0x5f);
    for (const id of [0, 1, 2, 4]) {
      expect(ram.get(0x2830 + id)).toBe(3);
      expect(ram.get(0x2837 + id)).toBe(0xe0);
    }
    expect(ram.get(0x2833)).toBeUndefined();
    expect(ram.get(0x262d)).toBe(0xa0);
    expect(ram.get(0x262e)).toBe(0x03);
    expect(ram.get(0x267d)).toBe(0x96);
    expect(ram.get(0x26cd)).toBe(0xa0);
    expect(ram.get(0x276d)).toBe(0xa0);
    expect(ram.get(0x271d)).toBeUndefined();
  });

  it('ORs into bytes that already hold bits', () => {
    const { ram, view, write } = fixture(true, { 0x101e0: 0x80, 0x2837: 0x10, 0x2830: 4 });
    createStartMagicGrant(write).observe(true, view);
    expect(ram.get(0x101e0)).toBe(0xdf);
    expect(ram.get(0x2837)).toBe(0xf0);
    expect(ram.get(0x2830)).toBe(7);
  });

  it('grants once, retries a refused write, and grants again after reset', () => {
    const refused = fixture(false);
    const stuck = createStartMagicGrant(refused.write);
    expect(stuck.observe(true, refused.view)).toBe(false);
    expect(stuck.granted()).toBe(false);
    const ok = fixture();
    const grant = createStartMagicGrant(ok.write);
    grant.observe(true, ok.view);
    ok.ram.set(0x101e0, 0);
    grant.observe(true, ok.view);
    expect(ok.ram.get(0x101e0)).toBe(0);
    grant.reset();
    grant.observe(true, ok.view);
    expect(ok.ram.get(0x101e0)).toBe(0x5f);
  });
});
