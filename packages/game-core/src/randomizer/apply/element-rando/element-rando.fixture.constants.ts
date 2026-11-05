/* @layer bridge-wasm @kind constants */
const GROUPS: readonly (readonly number[])[] = [
  [0], [1], [2], [3], [4], [5], [6], [1, 0], [0, 2], [3, 0],
];

const TECHS: readonly (readonly [group: number, element: number])[] = [
  [0, 0x82], [1, 0x22], [2, 0x12], [4, 0x22], [6, 0x82], [6, 0x42], [3, 0x42], [3, 0x12], [3, 0x82], [5, 0x04],
  [7, 0x22], [8, 0x42], [9, 0x42], [6, 0x00],
];

export { GROUPS, TECHS };
