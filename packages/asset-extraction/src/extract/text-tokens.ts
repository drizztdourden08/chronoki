/* @layer shared-asset-extraction @kind logic @source Python text.load_dict, text.decode_string */
import type { DecodeOptions } from './text-tokens.type';
import { decodeTokens } from './decode-tokens';

const decodeString = (rom: Uint8Array, off: number, subs: string[], opts: DecodeOptions = {}): string =>
  decodeTokens(rom, off, subs, null, opts);

export { decodeString };
export type { DecodeOptions };
