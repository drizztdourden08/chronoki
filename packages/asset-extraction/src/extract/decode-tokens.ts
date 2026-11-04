/* @layer shared-asset-extraction @kind logic */
import { DEFAULT_PB, DEFAULT_IND } from './text-tokens.constants';
import type { DecodeOptions } from './text-tokens.type';
import { at } from './rom-at';
import { parseCharacter } from './parse-character';
import { special } from './text-codes';

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

export { decodeTokens };
