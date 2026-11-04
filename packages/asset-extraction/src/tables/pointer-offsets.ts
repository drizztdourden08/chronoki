/* @layer shared-asset-extraction @kind logic */
import type { CType } from './c-type.type';

const pointerOffsets = (t: CType, base = 0): number[] => {
  if (t.tag === 'pointer') return [base];
  if (t.tag === 'array') {
    return Array.from({ length: t.n }, (_, k) => pointerOffsets(t.elem, base + k * t.elem.size)).flat();
  }
  if (t.tag === 'struct') return t.fields.flatMap((f) => pointerOffsets(f.type, base + f.offset));
  return [];
};

export { pointerOffsets };
