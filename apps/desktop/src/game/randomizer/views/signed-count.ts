/* @layer bridge-wasm @kind logic */
const signedCount = (count: number): string => (count > 0 ? `+${count}` : String(count));

export { signedCount };
