/* @layer shared-asset-extraction @kind constants */
const WINDOWS: [name: string, steps: [idx: number, dwell: number][]][] = [
  ['UP', [[0x01, 33], [0x02, 27], [0x01, 33], [0x00, 27]]],
  ['DOWN_idle', [[0x04, 27], [0x03, 33], [0x04, 27], [0x05, 33]]],
  ['LEFT', [[0x08, 33], [0x07, 27], [0x06, 27], [0x07, 33]]],
  ['RIGHT', [[0x0b, 33], [0x0a, 27], [0x09, 27], [0x0a, 33]]],
];

export { WINDOWS };
