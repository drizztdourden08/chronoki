/* @layer shared-asset-extraction @kind logic */
import { PackError } from '../pack-error';
import type { InitNode, PackToken } from '../pack.type';
import { unescape } from './unescape';
import type { ParseEnv } from './type-spec';

const concat = (parts: Uint8Array[]): Uint8Array => {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.length;
  }
  return out;
};

const parseExprTokens = (env: ParseEnv): InitNode => {
  const { cur } = env;
  const tokens: PackToken[] = [];
  let depth = 0;
  for (;;) {
    const s = cur.peek();
    if (s === null) throw new PackError(`${env.header}: unexpected end in an initializer`);
    if (depth === 0 && (s === ',' || s === '}' || s === ';')) break;
    if (s === '(') depth += 1;
    else if (s === ')') depth -= 1;
    const { kind, text } = cur.take();
    tokens.push({ kind, text });
  }
  return { kind: 'expr', tokens };
};

const parseInitializer = (env: ParseEnv): InitNode => {
  const { cur } = env;
  if (cur.peek() === '{') {
    cur.take('{');
    const items: InitNode[] = [];
    while (cur.peek() !== '}') {
      if (cur.peek() === '.' || cur.peek() === '[') throw new PackError(`${env.header}: designated initializers are not supported`);
      items.push(parseInitializer(env));
      if (cur.peek() === ',') cur.take();
      else if (cur.peek() !== '}') throw new PackError(`${env.header}: expected , or } near ${JSON.stringify(cur.peek())}`);
    }
    cur.take('}');
    return { kind: 'list', items };
  }
  if (cur.peekKind() === 'str') {
    const parts: Uint8Array[] = [];
    while (cur.peekKind() === 'str') parts.push(unescape(cur.take().text.slice(1, -1)));
    return { kind: 'str', bytes: concat(parts) };
  }
  return parseExprTokens(env);
};

export { parseInitializer };
