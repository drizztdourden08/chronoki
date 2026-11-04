/* @layer shared-asset-extraction @kind logic */
import { at } from './lz-decompress';
import { parseCharacter, special } from './text-codes';

const DICT_BASE = 0x1efa00;
const DICT_COUNT = 128;
const DEFAULT_PB = '\n———\n';
const DEFAULT_IND = '   ';

interface DecodeOptions {
  /** What the page-break codes 0x0B/0x0C render to; '\f' is the packer's marker mode. */
  pb?: string;
  /** Name codes emit a render-time marker. */
  namesub?: boolean;
  /** What the indent of the break tokens expands to. */
  ind?: string;
}

/**
 * text._decode_tokens: a token stream from `o`. With `length` null it runs to a NUL (dialogue), otherwise it
 * iterates exactly `length` tokens (dictionary substrings, no nested references).
 */
const decodeTokens = (
  rom: Uint8Array,
  start: number,
  subs: string[],
  length: number | null,
  { pb = DEFAULT_PB, namesub = false, ind = DEFAULT_IND }: DecodeOptions = {},
): string => {
  const out: string[] = [];
  let o = start;
  let count = 0;
  for (;;) {
    if (length !== null && count >= length) break;
    count += 1;
    const v = at(rom, o);
    o += 1;
    if (v === 0) break;
    if (v === 1 || v === 2) {
      out.push(parseCharacter(at(rom, o)));
      o += 1;
    } else if (v === 3) {
      const delay = at(rom, o);
      o += 1;
      if (pb === '\f') {
        if (delay === 0) {
          out.push('\x04');
          break;
        }
        out.push(`\x03${String.fromCharCode(0x41 + (delay >> 4))}${String.fromCharCode(0x41 + (delay & 15))}`);
      } else if (delay === 0) {
        break;
      }
    } else if (v === 0x0b) {
      out.push(pb);
    } else if ((v === 0x09 || v === 0x0a) && pb === '\f') {
      out.push(`\v${v === 0x0a ? ind : ''}`);
    } else if (v === 0x0c) {
      out.push(pb + ind);
    } else if (length === null && v >= 0x21 && v <= 0x9f) {
      out.push(subs[v - 0x21]!);
    } else if ((length === null && v > 0x9f) || (length !== null && v >= 0x9f)) {
      out.push(namesub && v === 0xe2 ? '”' : parseCharacter(v));
    } else {
      const [txt, extra] = special(v, namesub, ind);
      out.push(txt);
      o += extra;
    }
  }
  return out.join('');
};

/** text.load_dict: the 128 dictionary substrings. */
const loadDict = (rom: Uint8Array): string[] => {
  const subs: string[] = [];
  for (let i = 0; i < DICT_COUNT; i += 1) {
    const p = (rom[DICT_BASE + i * 2]! | (rom[DICT_BASE + i * 2 + 1]! << 8)) - 0xfa00;
    const o = DICT_BASE + p;
    subs.push(decodeTokens(rom, o + 1, [], rom[o]!));
  }
  return subs;
};

/** text.decode_string */
const decodeString = (rom: Uint8Array, off: number, subs: string[], opts: DecodeOptions = {}): string =>
  decodeTokens(rom, off, subs, null, opts);

export { decodeString, decodeTokens, loadDict };
export type { DecodeOptions };
