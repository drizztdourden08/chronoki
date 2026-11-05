/* @layer bridge-wasm @kind logic */
const objectiveBitCount = (bits: number): number => {
  let count = 0;
  for (let rest = bits; rest !== 0; rest >>= 1) count += rest & 1;
  return count;
};

export { objectiveBitCount };
