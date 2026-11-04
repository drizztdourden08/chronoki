/* @layer shared-asset-extraction @kind logic @source Python sprites.u16, sprites.get_entries_3byte, sprites.get_entries_2byte */
const u16 = (d: Uint8Array, o: number): number => d[o]! | (d[o + 1]! << 8);

const getEntries3Byte = (rom: Uint8Array, tableAddr: number, count: number): number[] => {
  const out: number[] = [];
  for (let i = 0; i < count; i += 1) {
    const o = tableAddr + i * 3;
    const ptr = rom[o]! | (rom[o + 1]! << 8);
    const bank = rom[o + 2]!;
    out.push(bank === 0 && ptr === 0 ? 0 : 0x10000 * (bank - 0xc0) + ptr);
  }
  return out;
};

const getEntries2Byte = (rom: Uint8Array, tableAddr: number, count: number): number[] => {
  const bankStart = tableAddr & 0xff0000;
  const out: number[] = [];
  for (let i = 0; i < count; i += 1) out.push(bankStart + u16(rom, tableAddr + i * 2));
  return out;
};

export { getEntries2Byte, getEntries3Byte, u16 };
