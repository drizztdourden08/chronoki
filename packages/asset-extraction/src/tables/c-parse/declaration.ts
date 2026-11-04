/* @layer shared-asset-extraction @kind logic */
import type { CType } from '../c-type.type';
import { describeType, makeArray, makePointer } from '../c-types';
import { countElements } from '../init-writer';
import { PackError } from '../pack-error';

import { parseInitializer } from './initializer';
import { isCharScalar, parseDims, parseTypeSpec } from './type-spec';
import type { ParseEnv } from './type-spec.type';
import type { DeclSink } from './declaration.type';

const parseTypedef = (env: ParseEnv): void => {
  const { cur } = env;
  cur.take();
  const base = parseTypeSpec(env).type;
  const name = cur.take().text;
  const t = parseDims(env, base).type;
  cur.take(';');
  const old = env.typedefs.get(name);
  if (old !== undefined && describeType(old) !== describeType(t)) {
    throw new PackError(`${env.header}: typedef ${name} differs from another header`);
  }
  env.typedefs.set(name, t);
};

const skipPointerTable = (env: ParseEnv, code: string, start: number, sink: DeclSink): void => {
  const { cur } = env;
  let depth = 0;
  for (;;) {
    const s = cur.take().text;
    if (s === '(') depth += 1;
    else if (s === ')') depth -= 1;
    else if (s === ';' && depth === 0) break;
  }
  const name = /\(\s*\*\s*const\s+(\w+)/.exec(code.slice(start, cur.lastEnd()))?.[1];
  if (name === undefined) throw new PackError(`${env.header}: cannot read a pointer table's name`);
  sink.passthrough.push({ header: env.header, name });
};

const tableElement = (env: ParseEnv, base: CType): CType => {
  const { cur } = env;
  if (cur.peek() !== '*') return base;
  cur.take();
  if (!isCharScalar(base)) throw new PackError(`${env.header}: only char pointers are supported`);
  if (cur.peek() !== 'const') throw new PackError(`${env.header}: a pointer table must be \`const char* const\``);
  cur.take('const');
  return makePointer(env.abi);
};

const parseTable = (env: ParseEnv, base: CType, anon: boolean, sink: DeclSink): void => {
  const { cur } = env;
  const element = tableElement(env, base);
  const name = cur.take().text;
  const dims = parseDims(env, element, true);
  if (dims.type.tag !== 'array') throw new PackError(`${env.header}: ${name} is not an array`);
  cur.take('=');
  const init = parseInitializer(env);
  cur.take(';');
  const ctype = dims.open ? makeArray(dims.type.elem, countElements(dims.type.elem, init, name)) : dims.type;
  sink.tables.push({ name, ctype, init, header: env.header, anon });
};

const parseDeclaration = (env: ParseEnv, code: string, sink: DeclSink): void => {
  const { cur } = env;
  const start = cur.nextStart();
  if (cur.peek() === 'typedef') return parseTypedef(env);
  if (cur.peek() !== 'static') {
    throw new PackError(`${env.header}: expected a typedef or a static declaration, found ${JSON.stringify(cur.peek())}`);
  }
  cur.take('static');
  const { type, isConst, anon } = parseTypeSpec(env);
  if (!isConst) throw new PackError(`${env.header}: a non-const static`);
  if (cur.peek() === '(') return skipPointerTable(env, code, start, sink);
  return parseTable(env, type, anon === true, sink);
};

export { parseDeclaration };
