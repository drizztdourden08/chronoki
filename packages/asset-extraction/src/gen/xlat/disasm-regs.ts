/* @layer shared-asset-extraction @kind constants */

/** disasm65816.REGS: the SNES hardware register names, by address. */
const REGS: Record<number, string> = {};
const names = (from: number, list: string): void => {
  list.split(' ').forEach((name, i) => {
    REGS[from + i] = name;
  });
};
names(0x2100, 'INIDISP OBSEL OAMADDL OAMADDH OAMDATA BGMODE MOSAIC BG1SC BG2SC BG3SC BG4SC BG12NBA BG34NBA BG1HOFS BG1VOFS BG2HOFS');
names(0x2110, 'BG2VOFS BG3HOFS BG3VOFS BG4HOFS BG4VOFS VMAIN VMADDL VMADDH VMDATAL VMDATAH M7SEL M7A M7B M7C M7D M7X');
names(0x2120, 'M7Y CGADD CGDATA W12SEL W34SEL WOBJSEL WH0 WH1 WH2 WH3 WBGLOG WOBJLOG TM TS TMW TSW');
names(0x2130, 'CGWSEL CGADSUB COLDATA SETINI MPYL MPYM MPYH SLHV OAMDATAREAD VMDATALREAD VMDATAHREAD CGDATAREAD OPHCT OPVCT STAT77 STAT78');
names(0x2140, 'APUIO0 APUIO1 APUIO2 APUIO3');
names(0x2180, 'WMDATA WMADDL WMADDM WMADDH');
names(0x4200, 'NMITIMEN WRIO WRMPYA WRMPYB WRDIVL WRDIVH WRDIVB HTIMEL HTIMEH VTIMEL VTIMEH MDMAEN HDMAEN MEMSEL');
names(0x4210, 'RDNMI TIMEUP HVBJOY RDIO RDDIVL RDDIVH RDMPYL RDMPYH JOY1L JOY1H JOY2L JOY2H JOY3L JOY3H JOY4L JOY4H');

const DMA_NAMES: Record<number, string> = {
  0: 'DMAP', 1: 'BBAD', 2: 'A1TL', 3: 'A1TH', 4: 'A1B', 5: 'DASL', 6: 'DASH', 7: 'DASB', 8: 'A2AL', 9: 'A2AH', 10: 'NTRL',
};

/** disasm65816.regname: the name of a register address, or null. */
const regName = (address: number): string | null => {
  const eff = address & 0xffff;
  const plain = REGS[eff];
  if (plain !== undefined) return plain;
  if (eff >= 0x4300 && eff <= 0x437f) {
    const nm = DMA_NAMES[eff & 0xf];
    return nm === undefined ? null : `${nm}${(eff >> 4) & 7}`;
  }
  return null;
};

export { regName, REGS };
