/* @layer shared-asset-extraction @kind logic */
import type { Headers } from '../c-parse/headers';
import { PackError } from '../pack-error';
import type { PackDefine, PackToken } from '../pack.type';
import { COMPILED_IN, DIM_REASON } from './storage-defines.constants';

type DefineCType = 'int' | 'unsigned';

interface RuntimeDefine extends PackDefine {
  ctype: DefineCType;
}

/** pack_tables.py dim_defines(): the #defines inside a [...] of the headers, and those their values use. */
const dimDefines = (hs: Headers): Set<string> => {
  const out = new Set<string>();
  for (const text of hs.texts.values()) {
    const code = text.replace(/^[ \t]*#(?:[^\n]*\\\n)*[^\n]*/gm, '');
    for (const m of code.matchAll(/\[([^\]]*)\]/g)) {
      for (const w of (m[1] as string).match(/[A-Za-z_]\w*/g) ?? []) if (hs.defines.has(w)) out.add(w);
    }
  }
  const todo = [...out];
  while (todo.length > 0) {
    for (const tok of hs.defines.get(todo.pop() as string) ?? []) {
      if (tok.kind === 'id' && hs.defines.has(tok.text) && !out.has(tok.text)) {
        out.add(tok.text);
        todo.push(tok.text);
      }
    }
  }
  return out;
};

/** pack_tables.py compiled_in(): the numeric #defines a data-free build keeps as constants. */
const compiledIn = (hs: Headers, defines: PackDefine[]): Set<string> => {
  const dims = dimDefines(hs);
  const names = new Set(defines.map((d) => d.name));
  for (const n of Object.keys(COMPILED_IN)) {
    if (!names.has(n)) throw new PackError(`COMPILED_IN names ${n}, which no header defines`);
  }
  return new Set([...names].filter((n) => dims.has(n) || n in COMPILED_IN));
};

const literalValue = (digits: string): bigint => (/^0\d+$/.test(digits) ? BigInt(`0o${digits.slice(1)}`) : BigInt(digits));

/** pack_tables.py define_ctype(): the type the compiler gives a run-time #define's literal, 'int' or 'unsigned'. */
const defineCType = (name: string, toks: PackToken[]): DefineCType => {
  const neg = toks.length === 2 && toks[0]?.text === '-';
  const lit = neg || toks.length === 1 ? toks[toks.length - 1] : undefined;
  if (lit === undefined || lit.kind !== 'num') {
    throw new PackError(`#define ${name}: a run-time #define must be one integer literal, not '${toks.map((t) => t.text).join(' ')}'`);
  }
  const suffix = (/[uUlL]*$/.exec(lit.text)?.[0] ?? '').toLowerCase();
  const digits = lit.text.slice(0, lit.text.length - suffix.length);
  const v = literalValue(digits);
  const decimal = !digits.startsWith('0') || digits === '0';
  if (suffix === 'u' && v <= 0xffffffffn && !neg) return 'unsigned';
  if (suffix === '' && v <= 0x7fffffffn) return 'int';
  if (suffix === '' && !decimal && v <= 0xffffffffn && !neg) return 'unsigned';
  throw new PackError(`#define ${name}: ${lit.text} is not an int or unsigned int literal (its type would differ between the targets)`);
};

/** pack_tables.py runtime_defines(): the numeric #defines a data-free build reads from the pack. */
const runtimeDefines = (hs: Headers, defines: PackDefine[]): RuntimeDefine[] => {
  const keep = compiledIn(hs, defines);
  return defines.filter((d) => !keep.has(d.name)).map((d) => ({ ...d, ctype: defineCType(d.name, hs.defines.get(d.name) ?? []) }));
};

export { compiledIn, runtimeDefines };
export type { RuntimeDefine };
