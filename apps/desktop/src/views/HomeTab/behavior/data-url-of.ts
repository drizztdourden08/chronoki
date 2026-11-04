/* @layer renderer-components @kind logic */
const CHUNK = 0x8000;

const dataUrlOf = (png: Uint8Array | null): string | null => {
  if (!png) return null;
  let binary = '';
  for (let at = 0; at < png.length; at += CHUNK) binary += String.fromCharCode(...png.subarray(at, at + CHUNK));
  return `data:image/png;base64,${btoa(binary)}`;
};

export { dataUrlOf };
