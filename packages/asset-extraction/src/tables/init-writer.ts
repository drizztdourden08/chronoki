/* @layer shared-asset-extraction @kind logic */
import type { CType } from './c-type.type';
import { describeType } from './c-types';

import { PackError } from './pack-error';
import type { InitNode } from './pack.type';
import type { FillArgs, WriterEnv } from './init-writer.type';
import { isAggregate } from './is-aggregate';
import { isCharArray } from './is-char-array';
import { subobjects } from './subobjects';

const writeUint = (buf: Uint8Array, off: number, value: bigint, size: number): void => {
  let rest = BigInt.asUintN(size * 8, value);
  for (let i = 0; i < size; i += 1) {
    buf[off + i] = Number(rest & 0xffn);
    rest >>= 8n;
  }
};

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

  const fill = ({ t, off, items, from, dry }: FillArgs): number => {
    let i = from;
    for (const sub of subobjects(t)) {
      if (i >= items.length) break;
      const it = items[i] as InitNode;
      if (it.kind === 'list') {
        braced(sub.type, off + sub.offset, it, dry);
        i += 1;
      } else if (it.kind === 'str' && isCharArray(sub.type)) {
        string(sub.type, off + sub.offset, it.bytes, dry);
        i += 1;
      } else if (isAggregate(sub.type)) {
        i = fill({ t: sub.type, off: off + sub.offset, items, from: i, dry });
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
      return scalar(t, off, items[0] as InitNode, dry);
    }
    const only = items[0];
    if (isCharArray(t) && items.length === 1 && only?.kind === 'str') return string(t, off, only.bytes, dry);
    const used = fill({ t, off, items, from: 0, dry });
    if (used !== items.length) err(`${items.length - used} excess initializers`);
    return undefined;
  };

  return { fill, braced };
};

export { createInitWriter };
