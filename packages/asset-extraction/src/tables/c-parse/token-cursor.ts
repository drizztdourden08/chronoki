/* @layer shared-asset-extraction @kind logic */
import { PackError } from '../pack-error';
import type { LexToken } from './lex-token.type';
import type { TokenCursor } from './token-cursor.type';

const createCursor = (toks: LexToken[], header: string): TokenCursor => {
  let p = 0;
  return {
    peek: (k = 0) => (p + k < toks.length ? (toks[p + k] as LexToken).text : null),
    peekKind: () => (p < toks.length ? (toks[p] as LexToken).kind : null),
    take: (want) => {
      if (p >= toks.length) throw new PackError(`${header}: unexpected end`);
      const tok = toks[p] as LexToken;
      if (want !== undefined && tok.text !== want) {
        throw new PackError(`${header}: expected ${JSON.stringify(want)}, found ${JSON.stringify(tok.text)} near offset ${tok.start}`);
      }
      p += 1;
      return tok;
    },
    done: () => p >= toks.length,
    nextStart: () => (toks[p] as LexToken).start,
    lastEnd: () => (toks[p - 1] as LexToken).end,
  };
};

export { createCursor };
