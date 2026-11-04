/* @layer shared-asset-extraction @kind logic */
import type { CType } from '../c-type.type';
import { makeStruct } from '../make-struct';
import { makePointer } from '../make-pointer';
import { PackError } from '../pack-error';

import { SCALAR_TYPES } from '../scalars.constants';
import type { ParseEnv, SpecState, TypeSpec } from './type-spec.type';
import { SCALAR_WORDS, UNSUPPORTED_WORDS } from './type-spec.constants';
import { parseDims } from './parse-dims';
import { isCharScalar } from './is-char-scalar';

const memberType = (env: ParseEnv, base: CType): CType => {
  const { cur } = env;
  if (cur.peek() !== '*') return base;
  cur.take();
  if (cur.peek() === 'const') throw new PackError(`${env.header}: a const pointer member`);
  if (!isCharScalar(base)) throw new PackError(`${env.header}: only char pointers are supported`);
  return makePointer(env.abi);
};

const parseStructBody = (env: ParseEnv): CType => {
  const { cur } = env;
  cur.take('{');
  const members: { name: string; type: CType }[] = [];
  while (cur.peek() !== '}') {
    const base = parseTypeSpec(env).type;
    for (;;) {
      const t = memberType(env, base);
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

const typedefStep = (env: ParseEnv, st: SpecState, s: string | null): TypeSpec | 'stop' => {
  const { cur } = env;
  if (st.words.length !== 0 || s === null || !(env.typedefs.has(s) || Object.hasOwn(SCALAR_TYPES, s))) return 'stop';
  cur.take();
  const known = env.typedefs.get(s);
  if (known !== undefined) return { type: known, isConst: st.isConst };
  st.words.push(s);
  return 'stop';
};

const specStep = (env: ParseEnv, st: SpecState): TypeSpec | 'next' | 'stop' => {
  const { cur } = env;
  const s = cur.peek();
  if (s === 'const') {
    cur.take();
    st.isConst = true;
    return 'next';
  }
  if (s === 'struct') {
    cur.take();
    if (cur.peek() !== '{') throw new PackError(`${env.header}: struct tags are not supported`);
    return { type: parseStructBody(env), isConst: st.isConst, anon: true };
  }
  if (s !== null && SCALAR_WORDS.includes(s)) {
    st.words.push(cur.take().text);
    return 'next';
  }
  if (s !== null && UNSUPPORTED_WORDS.includes(s)) {
    throw new PackError(`${env.header}: type ${s} is not supported (its size differs between the targets or it is not an integer)`);
  }
  return typedefStep(env, st, s);
};

const parseTypeSpec = (env: ParseEnv): TypeSpec => {
  const { cur } = env;
  const st: SpecState = { words: [], isConst: false };
  for (;;) {
    const step = specStep(env, st);
    if (step === 'next') continue;
    if (step === 'stop') break;
    return step;
  }
  const key = st.words.join(' ');
  if (st.words.length === 0 || !Object.hasOwn(SCALAR_TYPES, key)) {
    throw new PackError(`${env.header}: unknown type ${JSON.stringify(key)} near ${JSON.stringify(cur.peek())}`);
  }
  return { type: SCALAR_TYPES[key] as CType, isConst: st.isConst };
};

export { parseTypeSpec };
