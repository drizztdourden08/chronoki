/* @layer bridge-wasm @kind fixture */
const slotOf = (index: number): number => (index % 2 === 0 ? 3 + index : 0x80 | (3 + index));

export { slotOf };
