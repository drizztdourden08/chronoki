/* @layer bridge-wasm @kind logic */
import {
  CK_ENV_BYTES_PER_PIXEL, CK_EXPORT_ENV_HEIGHT, CK_EXPORT_ENV_PTR, CK_EXPORT_ENV_VALID, CK_EXPORT_ENV_WIDTH,
} from './env-frame.constants';
import type { CkEnvCalls, CkEnvFrame } from './env-frame.type';

const envFrameOf = (calls: CkEnvCalls | null): CkEnvFrame | null => {
  if (!calls || !calls.has(CK_EXPORT_ENV_VALID) || calls.number(CK_EXPORT_ENV_VALID) !== 1) return null;
  const width = calls.number(CK_EXPORT_ENV_WIDTH);
  const height = calls.number(CK_EXPORT_ENV_HEIGHT);
  const ptr = calls.number(CK_EXPORT_ENV_PTR);
  const heap = calls.heap();
  const size = width * height * CK_ENV_BYTES_PER_PIXEL;
  if (!heap || width <= 0 || height <= 0 || ptr <= 0 || ptr + size > heap.length) return null;
  return { data: heap.subarray(ptr, ptr + size), width, height };
};

export { envFrameOf };
