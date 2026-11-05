/* @layer bridge-wasm @kind logic */
const opEquals = (bytes: readonly number[]) => (op: Uint8Array): boolean =>
  op.length === bytes.length && bytes.every((byte, i) => op[i] === byte);

export { opEquals };
