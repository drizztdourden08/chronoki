/* @layer shared-asset-extraction @kind logic */
import { opLen } from './op-len';
import { TABLE } from './disasm.constants';
import { hx } from './hx';
import { TRACE_LINE } from './xlat-collect.constants';
import type { Site, Sites, XlatInput } from './xlat-site.type';

const parseBytes = (raw: string, len: number, adr: number): number[] => {
  const bytes: number[] = [];
  for (let j = 0; j < Math.min(len, 4); j += 1) {
    const byte = raw.slice(2 * j, 2 * j + 2);
    if (!/^[0-9A-F]{2}$/.test(byte)) throw new Error(`xlat: bad trace byte at ${hx(adr, 6)}`);
    bytes.push(Number.parseInt(byte, 16));
  }
  return bytes;
};

const merge = (s: Site, op: number, len: number, bytes: number[], adr: number): void => {
  if (s.op !== op) {
    throw new Error(`xlat: REFUSING -- ${hx(adr, 6)} executed two different opcodes (${hx(s.op, 2)}, ${hx(op, 2)})`);
  }
  s.variants.add(bytes.join(','));
  if (s.variants.size > 1) s.smc = true;
  if (len !== s.len) throw new Error(`xlat: REFUSING -- ${hx(adr, 6)} ran with two instruction lengths`);
};

const record = (sites: Sites, adr: number, mo: RegExpExecArray, image: string): void => {
  const raw = mo[3] as string;
  const p = mo[4] as string;
  const m = p[2] === 'M' ? 1 : 0;
  const x = p[3] === 'X' ? 1 : 0;
  const op = Number.parseInt(raw.slice(0, 2), 16);
  const len = 1 + opLen((TABLE[op] as readonly [string, string])[1], m, x);
  const bytes = parseBytes(raw, len, adr);
  const s = sites.get(adr);
  if (s === undefined) {
    sites.set(adr, { op, bytes, len, m, x, traced: true, smc: false, variants: new Set([bytes.join(',')]), image });
  } else {
    merge(s, op, len, bytes, adr);
  }
};

const addressOf = (mo: RegExpExecArray): number =>
  (Number.parseInt(mo[1] as string, 16) << 16) | Number.parseInt(mo[2] as string, 16);

const collectTrace = (sites: Sites, text: string, image: string, input: XlatInput): void => {
  const { starts, stops } = input;
  let live = starts.size === 0;
  for (const ln of text.split(/\r?\n/)) {
    const mo = ln.startsWith('-- frame') ? null : TRACE_LINE.exec(ln);
    if (!mo) continue;
    const adr = addressOf(mo);
    if (!live && !starts.has(adr)) continue;
    live = true;
    if (stops.has(adr)) {
      if (starts.size === 0) break;
      live = false;
      continue;
    }
    if (!(mo[3] as string).slice(0, 2).includes('?')) record(sites, adr, mo, image);
  }
};

const collectExecuted = (input: XlatInput): Sites => {
  const sites: Sites = new Map();
  for (const { text, image } of input.traces) collectTrace(sites, text, image, input);
  for (const st of input.stops) sites.delete(st);
  return sites;
};

export { collectExecuted };
