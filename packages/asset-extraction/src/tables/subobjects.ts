/* @layer shared-asset-extraction @kind logic */
import type { CType } from './c-type.type';

const subobjects = (t: CType): { type: CType; offset: number }[] => {
  if (t.tag === 'array') return Array.from({ length: t.n }, (_, k) => ({ type: t.elem, offset: k * t.elem.size }));
  if (t.tag === 'struct') return t.fields.map((f) => ({ type: f.type, offset: f.offset }));
  return [];
};

export { subobjects };
