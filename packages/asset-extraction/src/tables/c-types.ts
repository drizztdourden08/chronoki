/* @layer shared-asset-extraction @kind logic */
import type { CStruct, CStructField, CType } from './c-type.type';
import { makeScalar } from './make-scalar';

const roundUp = (value: number, align: number): number => Math.floor((value + align - 1) / align) * align;

const makeStruct = (members: { name: string; type: CType }[]): CStruct => {
  const fields: CStructField[] = [];
  let offset = 0;
  let align = 1;
  for (const { name, type } of members) {
    offset = roundUp(offset, type.align);
    fields.push({ name, type, offset });
    offset += type.size;
    align = Math.max(align, type.align);
  }
  return { tag: 'struct', fields, size: roundUp(offset, align), align };
};

const describeType = (t: CType): string => {
  if (t.tag === 'scalar') return t.kind;
  if (t.tag === 'pointer') return 'p';
  if (t.tag === 'array') return `${describeType(t.elem)}[${t.n}]`;
  return `{${t.fields.map((f) => `${f.name}:${describeType(f.type)}@${f.offset}`).join(';')}}#${t.size}`;
};

const pointerOffsets = (t: CType, base = 0): number[] => {
  if (t.tag === 'pointer') return [base];
  if (t.tag === 'array') {
    return Array.from({ length: t.n }, (_, k) => pointerOffsets(t.elem, base + k * t.elem.size)).flat();
  }
  if (t.tag === 'struct') return t.fields.flatMap((f) => pointerOffsets(f.type, base + f.offset));
  return [];
};

export { describeType, makeStruct, pointerOffsets };
