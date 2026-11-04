/* @layer shared-asset-extraction @kind logic */
import { PackError } from '../pack-error';
import { ESC } from './unescape.constants';

const readEscape = (body: string, i: number): [number, number] => {
  const e = body[i + 1];
  const hex = /^[0-9A-Fa-f]+/.exec(body.slice(i + 2));
  const oct = /^[0-7]{1,3}/.exec(body.slice(i + 1));
  if (e === 'x' && hex !== null) return [Number(BigInt.asUintN(8, BigInt(`0x${hex[0]}`))), 2 + hex[0].length];
  if (e !== undefined && oct !== null && '01234567'.includes(e)) return [parseInt(oct[0], 8) & 0xff, 1 + oct[0].length];
  if (e !== undefined && Object.hasOwn(ESC, e)) return [ESC[e] as number, 2];
  throw new PackError(`unknown escape \\${e ?? ''}`);
};

const unescape = (body: string): Uint8Array => {
  const out: number[] = [];
  let i = 0;
  while (i < body.length) {
    const c = body[i] as string;
    if (c.charCodeAt(0) > 127) throw new PackError(`non-ASCII character in a literal: ${JSON.stringify(body)}`);
    if (c !== '\\') {
      out.push(c.charCodeAt(0));
      i += 1;
      continue;
    }
    const [byte, advance] = readEscape(body, i);
    out.push(byte);
    i += advance;
  }
  return Uint8Array.from(out);
};

export { unescape };
