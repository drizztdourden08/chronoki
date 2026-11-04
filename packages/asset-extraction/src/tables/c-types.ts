/* @layer shared-asset-extraction @kind logic */
import type { CType } from './c-type.type';

const describeType = (t: CType): string => {
  if (t.tag === 'scalar') return t.kind;
  if (t.tag === 'pointer') return 'p';
  if (t.tag === 'array') return `${describeType(t.elem)}[${t.n}]`;
  return `{${t.fields.map((f) => `${f.name}:${describeType(f.type)}@${f.offset}`).join(';')}}#${t.size}`;
};

export { describeType };
