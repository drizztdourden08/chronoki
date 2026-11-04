/* @layer shared-asset-extraction @kind types */
import type { LexToken } from './lex-token.type';

interface TokenCursor {
  peek: (k?: number) => string | null;
  peekKind: () => string | null;
  take: (want?: string) => LexToken;
  done: () => boolean;
  nextStart: () => number;
  lastEnd: () => number;
}

export type { TokenCursor };
