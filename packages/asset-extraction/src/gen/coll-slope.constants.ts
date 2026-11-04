/* @layer shared-asset-extraction @kind constants */
const TABLES: [name: string, offset: number, note: string][] = [
  ['ctCollSlopeBF5', 0x9bf5, 'C0/9BF5: bit 7 = negate X after the shift; bits 0-6 = the LSR count'],
  ['ctCollSlopeC0B', 0x9c0b, 'C0/9C0B: the constant added after the shift'],
  ['ctCollSlopeC21', 0x9c21, 'C0/9C21: the EOR sign (00 keep / FF invert)'],
];

export { TABLES };
