/* @layer shared-asset-extraction @kind logic @source Python text.decode_tokens branches */
import type { TokenHandler, TokenState } from './text-tokens.type';
import { at } from './rom-at';
import { parseCharacter } from './parse-character';
import { special } from './text-codes';

const takeByte = (st: TokenState): number => {
  const b = at(st.rom, st.o);
  st.o += 1;
  return b;
};

const delayText = (delay: number): string =>
  `\x03${String.fromCharCode(0x41 + (delay >> 4))}${String.fromCharCode(0x41 + (delay & 15))}`;

const charPrefix: TokenHandler = (v, st) => {
  if (v !== 1 && v !== 2) return undefined;
  st.out.push(parseCharacter(takeByte(st)));
  return false;
};

const delayToken: TokenHandler = (v, st) => {
  if (v !== 3) return undefined;
  const delay = takeByte(st);
  if (st.pb !== '\f') return delay === 0;
  if (delay === 0) {
    st.out.push('\x04');
    return true;
  }
  st.out.push(delayText(delay));
  return false;
};

const pageBreak: TokenHandler = (v, st) => {
  if (v !== 0x0b) return undefined;
  st.out.push(st.pb);
  return false;
};

const indentBreak: TokenHandler = (v, st) => {
  if ((v !== 0x09 && v !== 0x0a) || st.pb !== '\f') return undefined;
  st.out.push(`\v${v === 0x0a ? st.ind : ''}`);
  return false;
};

const newPage: TokenHandler = (v, st) => {
  if (v !== 0x0c) return undefined;
  st.out.push(st.pb + st.ind);
  return false;
};

const dictSub: TokenHandler = (v, st) => {
  if (st.source.length !== null || v < 0x21 || v > 0x9f) return undefined;
  st.out.push(st.source.subs[v - 0x21] as string);
  return false;
};

const literal: TokenHandler = (v, st) => {
  const { length } = st.source;
  if (!((length === null && v > 0x9f) || (length !== null && v >= 0x9f))) return undefined;
  st.out.push(st.namesub && v === 0xe2 ? '”' : parseCharacter(v));
  return false;
};

const fallback: TokenHandler = (v, st) => {
  const [txt, extra] = special(v, st.namesub, st.ind);
  st.out.push(txt);
  st.o += extra;
  return false;
};

const HANDLERS: TokenHandler[] = [charPrefix, delayToken, pageBreak, indentBreak, newPage, dictSub, literal, fallback];

const stepToken = (v: number, st: TokenState): boolean => {
  for (const handler of HANDLERS) {
    const stop = handler(v, st);
    if (stop !== undefined) return stop;
  }
  return false;
};

export { stepToken, takeByte };
