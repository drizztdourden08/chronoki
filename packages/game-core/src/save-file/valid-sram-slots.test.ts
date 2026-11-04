/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { readSramSlotSummary } from './read-sram-slot-summary';
import { slotChecksum } from './slot-checksum';
import { validSramSlots } from './valid-sram-slots';

const SIZE = 0x2000;
const BASES = [0x0000, 0x0a00, 0x1400];

const sealSlot = (bytes: Uint8Array, slot: number): void => {
  const sum = slotChecksum(bytes, BASES[slot]);
  bytes[0x1ff0 + slot * 2] = sum & 0xff;
  bytes[0x1ff1 + slot * 2] = sum >> 8;
  bytes[0x1ff8 + slot * 2] = 0x1b;
  bytes[0x1ff9 + slot * 2] = 0xe4;
};

const makeSave = (): Uint8Array => {
  const bytes = new Uint8Array(SIZE);
  for (let i = 0; i < 0x0a00; i += 1) bytes[i] = (i * 7 + 3) & 0xff;
  bytes[0x0580] = 0x02;
  bytes.copyWithin(0x0a00, 0, 0x0a00);
  bytes.copyWithin(0x1400, 0, 0x0a00);
  [0, 1, 2].forEach((slot) => sealSlot(bytes, slot));
  return bytes;
};

describe('validSramSlots', { tags: ['critical'] }, () => {
  it('accepts sealed slots', () => {
    expect(validSramSlots(makeSave())).toEqual([0, 1, 2]);
  });

  it('rejects a slot whose data no longer matches its checksum', () => {
    const bytes = makeSave();
    bytes[0x0a00 + 0x100] ^= 0xff;
    expect(validSramSlots(bytes)).toEqual([0, 2]);
  });

  it('rejects a bad signature', () => {
    const bytes = makeSave();
    bytes[0x1ff9] = 0x00;
    expect(validSramSlots(bytes)).toEqual([1, 2]);
  });

  it('rejects an erased or short image', () => {
    expect(validSramSlots(new Uint8Array(SIZE))).toEqual([]);
    expect(validSramSlots(new Uint8Array(16))).toEqual([]);
  });

  it('reads the summary of a valid slot only', () => {
    const bytes = makeSave();
    expect(readSramSlotSummary(bytes, 0)?.leadId).toBe(2);
    bytes.set([0xab, 0xce, 0xbc, 0xbc, 0xef, 0xff], 0x05b0 + 2 * 6);
    sealSlot(bytes, 0);
    expect(readSramSlotSummary(bytes, 0)?.leadName).toBe('Lucc');
    bytes[0x0100] ^= 0x01;
    expect(readSramSlotSummary(bytes, 0)).toBeNull();
  });
});
