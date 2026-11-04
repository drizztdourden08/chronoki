/* @layer shared-asset-extraction @kind logic */
import type { CType } from '../c-type.type';
import { makeArray, makePointer, makeStruct } from '../c-types';
import { PackError } from '../pack-error';
import type { ConstEval, PackToken } from '../pack.type';
import { SCALAR_TYPES } from '../scalars.constants';
import type { TableAbi } from '../table-abi.type';
import type { TokenCursor } from './token-cursor';

/** What the declaration parsers share while one header is parsed. */
interface ParseEnv {
  cur: TokenCursor;
  header: string;
  abi: TableAbi;
  typedefs: Map<string, CType>;
  evalConst: ConstEval;
}

const SCALAR_WORDS = ['unsigned', 'signed', 'char', 'short', 'int'];
const UNSUPPORTED_WORDS = ['long', 'float', 'double', '_Bool', 'bool'];

const isCharScalar = (t: CType): boolean => t.tag === 'scalar' && t.kind === 'c8';

/** pack_tables.py dims(): `[expr]` suffixes; an open `[]` is allowed first, when asked (n comes back 0 and open true). */
const parseDims = (env: ParseEnv, base: CType, allowOpen = false): { type: CType; open: boolean } => {
  const ns: (number | null)[] = [];
  while (env.cur.peek() === '[') {
    env.cur.take('[');
    const expr: PackToken[] = [];
    while (env.cur.peek() !== ']') {
      const { kind, text } = env.cur.take();
      expr.push({ kind, text });
    }
    env.cur.take(']');
    if (expr.length === 0) {
      if (!allowOpen || ns.length > 0) throw new PackError(`${env.header}: an open array dimension here`);
      ns.push(null);
    } else {
      ns.push(Number(env.evalConst(expr, env.header)));
    }
  }
  let type = base;
  for (const n of [...ns].reverse()) type = makeArray(type, n ?? 0);
  return { type, open: ns[0] === null };
};

/** pack_tables.py struct_body(): `{ type name[dims], name2; ... }` -> the struct laid out for the target. */
const parseStructBody = (env: ParseEnv): CType => {
  const { cur } = env;
  cur.take('{');
  const members: { name: string; type: CType }[] = [];
  while (cur.peek() !== '}') {
    const base = parseTypeSpec(env).type;
    for (;;) {
      let t = base;
      if (cur.peek() === '*') {
        cur.take();
        if (cur.peek() === 'const') throw new PackError(`${env.header}: a const pointer member`);
        if (!isCharScalar(base)) throw new PackError(`${env.header}: only char pointers are supported`);
        t = makePointer(env.abi);
      }
      const name = cur.take().text;
      members.push({ name, type: parseDims(env, t).type });
      if (cur.peek() === ',') {
        cur.take();
        continue;
      }
      cur.take(';');
      break;
    }
  }
  cur.take('}');
  return makeStruct(members);
};

/** pack_tables.py type_spec(): const, an anonymous struct, a typedef name or the integer type words. */
const parseTypeSpec = (env: ParseEnv): { type: CType; isConst: boolean; anon?: boolean } => {
  const { cur } = env;
  const words: string[] = [];
  let isConst = false;
  for (;;) {
    const s = cur.peek();
    if (s === 'const') {
      cur.take();
      isConst = true;
    } else if (s === 'struct') {
      cur.take();
      if (cur.peek() !== '{') throw new PackError(`${env.header}: struct tags are not supported`);
      return { type: parseStructBody(env), isConst, anon: true };
    } else if (s !== null && SCALAR_WORDS.includes(s)) {
      words.push(cur.take().text);
    } else if (s !== null && UNSUPPORTED_WORDS.includes(s)) {
      throw new PackError(`${env.header}: type ${s} is not supported (its size differs between the targets or it is not an integer)`);
    } else if (words.length === 0 && s !== null && (env.typedefs.has(s) || Object.hasOwn(SCALAR_TYPES, s))) {
      cur.take();
      const known = env.typedefs.get(s);
      if (known !== undefined) return { type: known, isConst };
      words.push(s);
      break;
    } else {
      break;
    }
  }
  const key = words.join(' ');
  if (words.length === 0 || !Object.hasOwn(SCALAR_TYPES, key)) {
    throw new PackError(`${env.header}: unknown type ${JSON.stringify(key)} near ${JSON.stringify(cur.peek())}`);
  }
  return { type: SCALAR_TYPES[key], isConst };
};

export { isCharScalar, parseDims, parseTypeSpec };
export type { ParseEnv };
