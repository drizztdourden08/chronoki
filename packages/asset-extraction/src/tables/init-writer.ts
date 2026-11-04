/* @layer shared-asset-extraction @kind logic */
import type { CType } from './c-type.type';
import { describeType } from './c-types';
import { CHAR_KINDS } from './scalars.constants';
import { PackError } from './pack-error';
import type { ConstEval, InitNode } from './pack.type';
import type { StringPool } from './string-pool';

interface WriterEnv {
  tableName: string;
  header: string;
  buf: Uint8Array;
  relocs: number[];
  pool: StringPool;
  evalConst: ConstEval;
}

const isCharArray = (t: CType): boolean => t.tag === 'array' && t.elem.tag === 'scalar' && CHAR_KINDS.includes(t.elem.kind);
const isAggregate = (t: CType): boolean => t.tag === 'array' || t.tag === 'struct';

/** The sub-objects of an aggregate in initializer order, with their offsets. */
const subobjects = (t: CType): { type: CType; offset: number }[] => {
  if (t.tag === 'array') return Array.from({ length: t.n }, (_, k) => ({ type: t.elem, offset: k * t.elem.size }));
  if (t.tag === 'struct') return t.fields.map((f) => ({ type: f.type, offset: f.offset }));
  return [];
};

const writeUint = (buf: Uint8Array, off: number, value: bigint, size: number): void => {
  let rest = BigInt.asUintN(size * 8, value);
  for (let i = 0; i < size; i += 1) {
    buf[off + i] = Number(rest & 0xffn);
    rest >>= 8n;
  }
};

/**
 * pack_tables.py Writer: fills a table's bytes from its parsed initializer the way the compiler lays them out
 * (brace elision counted as C counts it), recording the pointer slots and putting strings in the pool.
 */
const createInitWriter = (env: WriterEnv) => {
  const err = (message: string): never => {
    throw new PackError(`${env.tableName} (${env.header}): ${message}`);
  };

  const pointer = (size: number, off: number, item: InitNode): void => {
    env.relocs.push(off);
    if (item.kind === 'str') return writeUint(env.buf, off, BigInt(env.pool.add(item.bytes)), size);
    if (item.kind === 'expr' && env.evalConst(item.tokens, env.tableName) === 0n) {
      return writeUint(env.buf, off, BigInt.asUintN(size * 8, -1n), size);
    }
    return err(`a pointer member initialized from ${item.kind}`);
  };

  const scalar = (t: CType, off: number, item: InitNode, dry: boolean): void => {
    if (dry) return;
    if (t.tag === 'pointer') return pointer(t.size, off, item);
    if (item.kind !== 'expr') return err(`scalar ${describeType(t)} initialized from ${item.kind}`);
    const v = env.evalConst(item.tokens, env.tableName);
    const bits = BigInt(8 * t.size);
    if (!(-(1n << (bits - 1n)) <= v && v < 1n << bits)) err(`value ${v} does not fit ${describeType(t)}`);
    return writeUint(env.buf, off, v, t.size);
  };

  const string = (t: CType, off: number, bytes: Uint8Array, dry: boolean): void => {
    if (t.tag === 'array' && bytes.length > t.n) err(`string of ${bytes.length} bytes into char[${t.n}]`);
    if (!dry) env.buf.set(bytes, off);
  };

  /** Initializes aggregate t from items[i:] without braces of its own; returns the next index. */
  const fill = (t: CType, off: number, items: InitNode[], from: number, dry: boolean): number => {
    let i = from;
    for (const sub of subobjects(t)) {
      if (i >= items.length) break;
      const it = items[i];
      if (it.kind === 'list') {
        braced(sub.type, off + sub.offset, it, dry);
        i += 1;
      } else if (it.kind === 'str' && isCharArray(sub.type)) {
        string(sub.type, off + sub.offset, it.bytes, dry);
        i += 1;
      } else if (isAggregate(sub.type)) {
        i = fill(sub.type, off + sub.offset, items, i, dry);
      } else {
        scalar(sub.type, off + sub.offset, it, dry);
        i += 1;
      }
    }
    return i;
  };

  const braced = (t: CType, off: number, node: InitNode, dry: boolean): void => {
    if (node.kind !== 'list') return err('a braced initializer was expected');
    const items = node.items;
    if (!isAggregate(t)) {
      if (items.length !== 1) err(`a braced scalar with ${items.length} items`);
      return scalar(t, off, items[0], dry);
    }
    const only = items[0] as InitNode | undefined;
    if (isCharArray(t) && items.length === 1 && only?.kind === 'str') return string(t, off, only.bytes, dry);
    const used = fill(t, off, items, 0, dry);
    if (used !== items.length) err(`${items.length - used} excess initializers`);
    return undefined;
  };

  return { fill, braced };
};

/** The first dimension an open array `T x[] = {...}` gets: the elements its initializer fills. */
const countElements = (elem: CType, init: InitNode, name: string): number => {
  if (init.kind !== 'list') throw new PackError(`${name}: an open array needs a braced initializer`);
  const dry = createInitWriter({
    tableName: name,
    header: '?',
    buf: new Uint8Array(0),
    relocs: [],
    pool: { add: () => 0, bytes: () => new Uint8Array(0) },
    evalConst: () => 0n,
  });
  const items = init.items;
  let i = 0;
  let n = 0;
  while (i < items.length) {
    const it = items[i];
    const flat = it.kind === 'list' || !isAggregate(elem) || (it.kind === 'str' && isCharArray(elem));
    i = flat ? i + 1 : dry.fill(elem, 0, items, i, true);
    n += 1;
  }
  return n;
};

export { countElements, createInitWriter, isAggregate, isCharArray, subobjects };
export type { WriterEnv };
