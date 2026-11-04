/* @layer shared-asset-extraction @kind logic */
import type { CType } from '../c-type.type';
import { makeArray } from '../make-array';
import { PackError } from '../pack-error';
import type { PackToken } from '../pack.type';
import type { ParseEnv } from './type-spec.type';

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

export { parseDims };
