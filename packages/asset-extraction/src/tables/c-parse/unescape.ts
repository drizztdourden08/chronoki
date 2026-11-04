/* @layer shared-asset-extraction @kind logic */
import { PackError } from '../pack-error';

const ESC: Record<string, number> = { n: 10, t: 9, r: 13, '0': 0, '\\': 92, '"': 34, "'": 39, a: 7, b: 8, f: 12, v: 11, '?': 63 };

/**
 * pack_tables.py unescape(): a C literal's body (no quotes) -> its bytes. The source is UTF-8; a non-ASCII
 * character is refused (the compilers would not agree on its bytes).
 */
const unescape = (body: string): Uint8Array => {
  const out: number[] = [];
  let i = 0;
  while (i < body.length) {
    const c = body[i];
    if (c.charCodeAt(0) > 127) throw new PackError(`non-ASCII character in a literal: ${JSON.stringify(body)}`);
    if (c !== '\\') {
      out.push(c.charCodeAt(0));
      i += 1;
      continue;
    }
    const e = body[i + 1];
    const hex = /^[0-9A-Fa-f]+/.exec(body.slice(i + 2));
    const oct = /^[0-7]{1,3}/.exec(body.slice(i + 1));
    if (e === 'x' && hex !== null) {
      out.push(Number(BigInt.asUintN(8, BigInt(`0x${hex[0]}`))));
      i += 2 + hex[0].length;
    } else if (e !== undefined && oct !== null && '01234567'.includes(e)) {
      out.push(parseInt(oct[0], 8) & 0xff);
      i += 1 + oct[0].length;
    } else if (e !== undefined && Object.hasOwn(ESC, e)) {
      out.push(ESC[e]);
      i += 2;
    } else {
      throw new PackError(`unknown escape \\${e ?? ''}`);
    }
  }
  return Uint8Array.from(out);
};

export { unescape };
