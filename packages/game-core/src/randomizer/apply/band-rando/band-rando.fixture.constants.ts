/* @layer bridge-wasm @kind constants */
const HEAL_ROWS: readonly (readonly [number, number, number, number])[] = [
  [1, 1, 1, 50], [2, 1, 4, 50], [3, 1, 10, 50], [4, 2, 1, 10], [5, 2, 3, 10], [6, 2, 6, 10],
];
const HEAL_ENTRY_COUNT = 20;
const ATTACK_ROWS: readonly (readonly [number, number, number])[] = [[1, 1, 10], [2, 3, 20], [3, 2, 8], [4, 5, 40], [5, 1, 30]];
const TECH_REFS: readonly (readonly number[])[] = [[1, 0x80], [2, 0x83], [0x82, 0], [0x84, 0]];

export { ATTACK_ROWS, HEAL_ENTRY_COUNT, HEAL_ROWS, TECH_REFS };
