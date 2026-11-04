/* @layer shared-asset-extraction @kind logic @source Python sprites.u16, sprites.get_entries_3byte, sprites.get_entries_2byte */

const getEntries3Byte = (rom: Uint8Array, tableAddr: number, count: number): number[] => {
  const out: number[] = [];
  for (let i = 0; i < count; i += 1) {
    const o = tableAddr + i * 3;
    const ptr = (rom[o] as number) | ((rom[o + 1] as number) << 8);
    const bank = rom[o + 2] as number;
    out.push(bank === 0 && ptr === 0 ? 0 : 0x10000 * (bank - 0xc0) + ptr);
  }
  return out;
};

export { getEntries3Byte };
