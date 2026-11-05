/* @layer bridge-wasm @kind logic */
import { OBJECT_FUNCTIONS, OBJECT_HEADER_BYTES } from '../../checks/gift-ops.constants';
import { pointerAt } from './pointer-at';

const functionStarts = (raw: Uint8Array): number[] => {
  const header = (raw[0] ?? 0) * OBJECT_HEADER_BYTES;
  const starts = new Set<number>();
  for (let k = 0; k < (raw[0] ?? 0) * OBJECT_FUNCTIONS; k += 1) {
    const p = pointerAt(raw, k);
    if (p >= header && p < raw.length - 1) starts.add(p);
  }
  return [...starts].sort((a, b) => a - b);
};

export { functionStarts };
