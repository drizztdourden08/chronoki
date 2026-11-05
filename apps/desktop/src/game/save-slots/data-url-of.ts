/* @layer bridge-wasm @kind logic */
import { DATA_URL_CHUNK } from './save-slots.constants';

const dataUrlOf = (png: Uint8Array | null): string | null => {
  if (!png) return null;
  let binary = '';
  for (let at = 0; at < png.length; at += DATA_URL_CHUNK) binary += String.fromCharCode(...png.subarray(at, at + DATA_URL_CHUNK));
  return `data:image/png;base64,${btoa(binary)}`;
};

export { dataUrlOf };
