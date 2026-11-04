/* @layer shared-asset-extraction @kind logic */

const hiromOffset = (addr: number, romSize: number): number | null => {
  const bank = (addr >> 16) & 0xff;
  const low = addr & 0xffff;
  const b = bank & 0x7f;
  if (low >= 0x8000 || b >= 0x40) return ((((b & 0x3f) << 16) | low) & (romSize - 1)) >>> 0;
  return null;
};

export { hiromOffset };
