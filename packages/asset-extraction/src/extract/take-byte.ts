/* @layer shared-asset-extraction @kind logic @source Python text.decode_tokens branches */
import type { TokenState } from './text-tokens.type';
import { at } from './rom-at';

const takeByte = (st: TokenState): number => {
  const b = at(st.rom, st.o);
  st.o += 1;
  return b;
};

export { takeByte };
