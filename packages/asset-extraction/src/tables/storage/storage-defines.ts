/* @layer shared-asset-extraction @kind logic */
import type { Headers } from '../c-parse/headers.type';
import { PackError } from '../pack-error';
import type { PackDefine, PackToken } from '../pack.type';

import type { DefineCType, RuntimeDefine } from './storage-defines.type';
import { compiledIn } from './compiled-in';

const literalValue = (digits: string): bigint => (/^0\d+$/.test(digits) ? BigInt(`0o${digits.slice(1)}`) : BigInt(digits));

const literalToken = (name: string, toks: PackToken[]): { lit: PackToken; neg: boolean } => {
  const neg = toks.length === 2 && toks[0]?.text === '-';
  const lit = neg || toks.length === 1 ? toks[toks.length - 1] : undefined;
  if (lit?.kind !== 'num') {
    throw new PackError(`#define ${name}: a run-time #define must be one integer literal, not '${toks.map((t) => t.text).join(' ')}'`);
  }
  return { lit, neg };
};

const classify = (suffix: string, digits: string, neg: boolean): DefineCType | null => {
  const v = literalValue(digits);
  if (suffix === 'u') return v <= 0xffffffffn && !neg ? 'unsigned' : null;
  if (suffix !== '') return null;
  if (v <= 0x7fffffffn) return 'int';
  const decimal = !digits.startsWith('0') || digits === '0';
  return !decimal && v <= 0xffffffffn && !neg ? 'unsigned' : null;
};

const defineCType = (name: string, toks: PackToken[]): DefineCType => {
  const { lit, neg } = literalToken(name, toks);
  const suffix = (/[uUlL]*$/.exec(lit.text)?.[0] ?? '').toLowerCase();
  const digits = lit.text.slice(0, lit.text.length - suffix.length);
  const type = classify(suffix, digits, neg);
  if (type !== null) return type;
  throw new PackError(`#define ${name}: ${lit.text} is not an int or unsigned int literal (its type would differ between the targets)`);
};

const runtimeDefines = (hs: Headers, defines: PackDefine[]): RuntimeDefine[] => {
  const keep = compiledIn(hs, defines);
  return defines.filter((d) => !keep.has(d.name)).map((d) => ({ ...d, ctype: defineCType(d.name, hs.defines.get(d.name) ?? []) }));
};

export { runtimeDefines };
