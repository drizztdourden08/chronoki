/* @layer shared-asset-extraction @kind constants */
const TABLE_BYTES = 0x400;
const TABLES: [name: string, offset: number, note: string][] = [
  ['ctBattleAtanTab', 0xf300, 'C0/F300 arctangent (C1/0222)'],
  ['ctBattleSinTab', 0xf900, 'C0/F900 sine, signed-when-idx>=0x200 (CF/F9FB, C1/01F9)'],
  ['ctBattleFaceTab', 0xf700, 'C0/F700 facing/octant (C1/379A)'],
];

export { TABLE_BYTES, TABLES };
