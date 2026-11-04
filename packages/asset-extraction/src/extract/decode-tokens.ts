/* @layer shared-asset-extraction @kind logic */
import { DEFAULT_PB, DEFAULT_IND } from './text-tokens.constants';
import type { DecodeOptions, TokenSource, TokenState } from './text-tokens.type';
import { takeByte } from './take-byte';
import { stepToken } from './token-handlers';

const decodeTokens = (
  rom: Uint8Array,
  start: number,
  source: TokenSource,
  { pb = DEFAULT_PB, namesub = false, ind = DEFAULT_IND }: DecodeOptions = {},
): string => {
  const st: TokenState = { rom, o: start, out: [], pb, namesub, ind, source };
  let count = 0;
  for (;;) {
    if (source.length !== null && count >= source.length) break;
    count += 1;
    const v = takeByte(st);
    if (v === 0 || stepToken(v, st)) break;
  }
  return st.out.join('');
};

export { decodeTokens };
