/* @layer shared-asset-extraction @kind logic */
import type { CType } from '../c-type.type';
import { makeStruct } from '../make-struct';
import { makePointer } from '../make-pointer';
import { PackError } from '../pack-error';

import { SCALAR_TYPES } from '../scalars.constants';
import type { ParseEnv } from './type-spec.type';
import { SCALAR_WORDS, UNSUPPORTED_WORDS } from './type-spec.constants';
import { parseDims } from './parse-dims';
import { isCharScalar } from './is-char-scalar';

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
  return { type: SCALAR_TYPES[key] as CType, isConst };
};

export { parseTypeSpec };
