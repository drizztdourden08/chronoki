/* @layer shared-asset-extraction @kind logic */
/** disasm65816.hirom_off: a 24-bit CPU address -> the ROM file offset (HiROM), or null when it is not ROM. */
const hiromOffset = (addr: number, romSize: number): number | null => {
  const bank = (addr >> 16) & 0xff;
  const low = addr & 0xffff;
  const b = bank & 0x7f;
  if (low >= 0x8000 || b >= 0x40) return ((((b & 0x3f) << 16) | low) & (romSize - 1)) >>> 0;
  return null;
};

/** ctlib/rom.py off_to_snes: a file offset -> [bank, addr16] in the $C0-$FF mapping. */
const offsetToSnes = (offset: number): [number, number] => [0xc0 + (offset >> 16), offset & 0xffff];

/** A copy of rom[lo:hi] (Python's slice: the bytes, cut short at the end of the ROM). */
const romRegion = (rom: Uint8Array, lo: number, hi: number): Uint8Array => rom.slice(lo, hi);

export { hiromOffset, offsetToSnes, romRegion };
