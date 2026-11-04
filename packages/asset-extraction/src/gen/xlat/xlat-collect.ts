/* @layer shared-asset-extraction @kind logic */
import { opLen, TABLE } from './disasm';
import type { Sites, XlatInput } from './xlat-site.type';

const TRACE_LINE = /^([0-9A-F]{2}):([0-9A-F]{4}) ((?:[0-9A-F?]{2}){4}) .* P=(\S{8})/;

const hex6 = (adr: number): string => adr.toString(16).toUpperCase().padStart(6, '0');

const collectExecuted = (input: XlatInput): Sites => {
  const sites: Sites = new Map();
  const { starts, stops } = input;
  for (const { text, image } of input.traces) {
    let live = starts.size === 0;
    for (const ln of text.split(/\r?\n/)) {
      if (ln.startsWith('-- frame')) continue;
      const mo = TRACE_LINE.exec(ln);
      if (!mo) continue;
      const adr = (Number.parseInt(mo[1] as string, 16) << 16) | Number.parseInt(mo[2] as string, 16);
      if (!live) {
        if (!starts.has(adr)) continue;
        live = true;
      }
      if (stops.has(adr)) {
        if (starts.size === 0) break;
        live = false;
        continue;
      }
      const raw = mo[3] as string;
      if (raw.slice(0, 2).includes('?')) continue;
      const p = mo[4] as string;
      const m = p[2] === 'M' ? 1 : 0;
      const x = p[3] === 'X' ? 1 : 0;
      const op = Number.parseInt(raw.slice(0, 2), 16);
      const len = 1 + opLen((TABLE[op] as readonly [string, string])[1], m, x);
      const bytes: number[] = [];
      for (let j = 0; j < Math.min(len, 4); j += 1) {
        const byte = raw.slice(2 * j, 2 * j + 2);
        if (!/^[0-9A-F]{2}$/.test(byte)) throw new Error(`xlat: bad trace byte at ${hex6(adr)}`);
        bytes.push(Number.parseInt(byte, 16));
      }
      const s = sites.get(adr);
      if (s === undefined) {
        sites.set(adr, { op, bytes, len, m, x, traced: true, smc: false, variants: new Set([bytes.join(',')]), image });
      } else {
        if (s.op !== op) {
          throw new Error(`xlat: REFUSING -- ${hex6(adr)} executed two different opcodes (${s.op.toString(16).toUpperCase().padStart(2, '0')}, ${op.toString(16).toUpperCase().padStart(2, '0')})`);
        }
        s.variants.add(bytes.join(','));
        if (s.variants.size > 1) s.smc = true;
        if (len !== s.len) throw new Error(`xlat: REFUSING -- ${hex6(adr)} ran with two instruction lengths`);
      }
    }
  }
  for (const st of stops) sites.delete(st);
  return sites;
};

export { collectExecuted, hex6 };
