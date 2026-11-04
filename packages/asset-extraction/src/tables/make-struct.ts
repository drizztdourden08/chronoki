/* @layer shared-asset-extraction @kind logic */
import type { CStruct, CStructField, CType } from './c-type.type';
import { roundUp } from './round-up';

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

export { makeStruct };
