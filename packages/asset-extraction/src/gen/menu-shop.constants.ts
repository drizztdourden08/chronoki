/* @layer shared-asset-extraction @kind constants */
const OPEN = '0:10,100:2,0:150';
const DRIVES: [string, string, number][] = [
  ['main', OPEN, 162],
  ['buy', `${OPEN},100:2,0:40`, 204],
  ['qty', `${OPEN},100:2,0:40,100:2,0:40`, 246],
];
const TMW = 32;
const TMH = 28;
const BASE = 0x6000;
const NTILE = 0x88;

export { OPEN, DRIVES, TMW, TMH, BASE, NTILE };
