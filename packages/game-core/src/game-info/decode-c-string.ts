/* @layer bridge-wasm @kind logic */
const MAX_C_STRING = 256;

const decodeCString = (heap: Uint8Array, at: number): string => {
  let text = '';
  for (let i = at; i < at + MAX_C_STRING && i < heap.length; i += 1) {
    const byte = heap[i] ?? 0;
    if (byte === 0) break;
    text += String.fromCharCode(byte);
  }
  return text;
};

export { decodeCString };
