/* @layer shared-asset-extraction @kind logic */
import type { Form, Operand, OperandSite } from './disasm.type';
import { hx as hex } from './hx';

const plain = (o: string): Operand => ({ o, t: null });

const immediate: Form = (val, ob) => (ob.length === 1 ? `#$${hex(val, 2)}` : `#$${hex(val, 4)}`);

const plainForms = new Map<string, Form>([
  ['immM', immediate],
  ['immX', immediate],
  ['imm8', immediate],
  ['imp', () => ''],
  ['acc', () => 'A'],
  ['dp', (val) => `$${hex(val, 2)}`],
  ['dpx', (val) => `$${hex(val, 2)},X`],
  ['dpy', (val) => `$${hex(val, 2)},Y`],
  ['idp', (val) => `($${hex(val, 2)})`],
  ['idx', (val) => `($${hex(val, 2)},X)`],
  ['idy', (val) => `($${hex(val, 2)}),Y`],
  ['idl', (val) => `[$${hex(val, 2)}]`],
  ['idly', (val) => `[$${hex(val, 2)}],Y`],
  ['sr', (val) => `$${hex(val, 2)},S`],
  ['isy', (val) => `($${hex(val, 2)},S),Y`],
  ['abs', (val) => `$${hex(val, 4)}`],
  ['abx', (val) => `$${hex(val, 4)},X`],
  ['aby', (val) => `$${hex(val, 4)},Y`],
  ['abl', (val) => `$${hex(val, 6)}`],
  ['alx', (val) => `$${hex(val, 6)},X`],
  ['ind', (val) => `($${hex(val, 4)})`],
  ['iax', (val) => `($${hex(val, 4)},X)`],
  ['ial', (val) => `[$${hex(val, 4)}]`],
  ['bm', (_val, ob) => `$${hex(ob[0] as number, 2)},$${hex(ob[1] as number, 2)}`],
]);

const branch = (k: number, offset: number): Operand => {
  const t = (k << 16) | (offset & 0xffff);
  return { o: `$${hex(t & 0xffff, 4)}`, t };
};

const operandText = (mode: string, site: OperandSite, val: number): Operand => {
  const form = plainForms.get(mode);
  if (form) return plain(form(val, site.ob));
  if (mode === 'rel') return branch(site.k, site.pc + 2 + (val < 0x80 ? val : val - 0x100));
  if (mode === 'rell') return branch(site.k, site.pc + 3 + (val < 0x8000 ? val : val - 0x10000));
  return plain('?');
};

export { operandText };
