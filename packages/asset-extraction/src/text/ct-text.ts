/* @layer shared-asset-extraction @kind logic */
import { special } from './control-codes';
import { parseCharacter } from './parse-character';

const DICT_BASE = 0x1efa00;
const DICT_COUNT = 128;
const PAGE_BREAK = '\n———\n';

interface DecodeOptions {
  /** What the page-break codes render to; '\f' selects the packer's markers. */
  pb?: string;
  namesub?: boolean;
  ind?: string;
}

/** Python's rom[o]: an index past the end raises, it does not read undefined. */
const at = (rom: Uint8Array, o: number): number => {
  const v = rom[o];
  if (v === undefined) throw new RangeError(`index ${o} is outside the ROM`);
  return v;
};

/** text.py _decode_tokens: a token stream to its text and the offset after it. `length` null runs to the NUL. */
const decodeTokens = (
  rom: Uint8Array,
  start: number,
  subs: string[],
  length: number | null,
  { pb = PAGE_BREAK, namesub = false, ind = '   ' }: DecodeOptions = {},
): [string, number] => {
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
      } else if (delay === 0) break;
    } else if (v === 0x0b) out.push(pb);
    else if ((v === 0x09 || v === 0x0a) && pb === '\f') out.push(`\v${v === 0x0a ? ind : ''}`);
    else if (v === 0x0c) out.push(pb + ind);
    else if (length === null && v >= 0x21 && v <= 0x9f) out.push(subs[v - 0x21] as string);
    else if ((length === null && v > 0x9f) || (length !== null && v >= 0x9f)) {
      out.push(namesub && v === 0xe2 ? '”' : parseCharacter(v));
    } else {
      const [txt, extra] = special(v, namesub, ind);
      out.push(txt);
      o += extra;
    }
  }
  return [out.join(''), o];
};

/** text.py load_dict: the 128 dictionary substrings at $1EFA00. */
const loadDict = (rom: Uint8Array): string[] => {
  const subs: string[] = [];
  for (let i = 0; i < DICT_COUNT; i += 1) {
    const p = (at(rom, DICT_BASE + i * 2) | (at(rom, DICT_BASE + i * 2 + 1) << 8)) - 0xfa00;
    const o = DICT_BASE + p;
    subs.push(decodeTokens(rom, o + 1, [], at(rom, o))[0]);
  }
  return subs;
};

/** text.py decode_string: a dialogue-style token string at file offset `off`. */
const decodeString = (rom: Uint8Array, off: number, subs: string[], options: DecodeOptions = {}): string =>
  decodeTokens(rom, off, subs, null, options)[0];

export { decodeString, decodeTokens, loadDict };
export type { DecodeOptions };
