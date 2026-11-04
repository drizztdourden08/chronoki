/* @layer shared-asset-extraction @kind logic */
import { PackError } from '../pack-error';
import type { LexToken } from './lex-token.type';

interface TokenCursor {
  /** The text of the token k ahead, or null past the end. */
  peek: (k?: number) => string | null;
  /** The kind of the next token, or null past the end. */
  peekKind: () => string | null;
  take: (want?: string) => LexToken;
  done: () => boolean;
  /** The offset in the code where the next token starts. */
  nextStart: () => number;
  /** The offset in the code where the last taken token ends. */
  lastEnd: () => number;
}

/** pack_tables.py Headers.peek / take over one header's tokens. */
const createCursor = (toks: LexToken[], header: string): TokenCursor => {
  let p = 0;
  return {
    peek: (k = 0) => (p + k < toks.length ? toks[p + k].text : null),
    peekKind: () => (p < toks.length ? toks[p].kind : null),
    take: (want) => {
      if (p >= toks.length) throw new PackError(`${header}: unexpected end`);
      const tok = toks[p];
      if (want !== undefined && tok.text !== want) {
        throw new PackError(`${header}: expected ${JSON.stringify(want)}, found ${JSON.stringify(tok.text)} near offset ${tok.start}`);
      }
      p += 1;
      return tok;
    },
    done: () => p >= toks.length,
    nextStart: () => toks[p].start,
    lastEnd: () => toks[p - 1].end,
  };
};

export { createCursor };
export type { TokenCursor };
