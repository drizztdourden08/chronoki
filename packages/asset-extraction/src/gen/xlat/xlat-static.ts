/* @layer shared-asset-extraction @kind logic */
import { opLen, TABLE } from './disasm';
import type { Site, Sites, XlatInput } from './xlat-site.type';

const BRANCH = new Set([0x10, 0x30, 0x50, 0x70, 0x90, 0xb0, 0xd0, 0xf0]);
const ENDS = new Set([0x60, 0x6b, 0x40, 0x6c, 0x7c, 0xdc, 0x80, 0x82, 0x4c, 0x5c, 0x00, 0x02, 0xdb, 0xcb, 0x42]);
const STATIC_RUN = 48;
const NOT_CODE = new Set([0x00, 0x02, 0xdb, 0xcb, 0x42]);

interface Successors {
  targets: number[];
  falls: boolean;
  next: number;
  m: number;
  x: number;
}

const successors = (adr: number, s: Site): Successors => {
  const { op, bytes: b, len } = s;
  const k = adr >> 16;
  const pc = adr & 0xffff;
  let { m, x } = s;
  if (op === 0xc2) {
    if ((b[1] as number) & 0x20) m = 0;
    if ((b[1] as number) & 0x10) x = 0;
  }
  if (op === 0xe2) {
    if ((b[1] as number) & 0x20) m = 1;
    if ((b[1] as number) & 0x10) x = 1;
  }
  const next = (k << 16) | ((pc + len) & 0xffff);
  const targets: number[] = [];
  if (BRANCH.has(op) || op === 0x80) {
    const rel = (b[1] as number) >= 0x80 ? (b[1] as number) - 256 : (b[1] as number);
    targets.push((k << 16) | ((pc + 2 + rel) & 0xffff));
  }
  if (op === 0x82) {
    let rel = (b[1] as number) | ((b[2] as number) << 8);
    if (rel >= 0x8000) rel -= 0x10000;
    targets.push((k << 16) | ((pc + 3 + rel) & 0xffff));
  }
  if (op === 0x20 || op === 0x4c) targets.push((k << 16) | (b[1] as number) | ((b[2] as number) << 8));
  if (op === 0x22 || op === 0x5c) targets.push((b[1] as number) | ((b[2] as number) << 8) | ((b[3] as number) << 16));
  return { targets, falls: !ENDS.has(op), next, m, x };
};

interface Work {
  adr: number;
  m: number;
  x: number;
  depth: number;
  image: string;
}

const memByte = (input: XlatInput, image: string, adr: number): number | undefined => {
  const k = adr >> 16;
  const p = adr & 0xffff;
  const wram = input.images.get(image) as Uint8Array;
  if (k === 0x7e || k === 0x7f) return wram[((k & 1) << 16) | p];
  if ((k < 0x40 || (k >= 0x80 && k < 0xc0)) && p < 0x2000) return wram[p];
  if (p >= 0x8000 || (k & 0x7f) >= 0x40) return input.rom[(((k & 0x3f) << 16) | p) % input.rom.length];
  return undefined;
};

const decode = (input: XlatInput, image: string, adr: number, m: number, x: number): { op: number; bytes: number[]; len: number } | null => {
  const b0 = memByte(input, image, adr);
  if (b0 === undefined) return null;
  const len = 1 + opLen((TABLE[b0] as readonly [string, string])[1], m, x);
  const bytes: number[] = [];
  for (let j = 0; j < len; j += 1) {
    const v = memByte(input, image, adr + j);
    if (v === undefined) return null;
    bytes.push(v);
  }
  return { op: b0, bytes, len };
};

const extendStatically = (input: XlatInput, sites: Sites): number => {
  const work: Work[] = [];
  for (const [adr, s] of [...sites]) {
    if (!BRANCH.has(s.op)) continue;
    const r = successors(adr, s);
    for (const t of r.targets) work.push({ adr: t, m: r.m, x: r.x, depth: 0, image: s.image });
    if (r.falls) work.push({ adr: r.next, m: r.m, x: r.x, depth: 0, image: s.image });
  }
  let added = 0;
  for (let w = work.pop(); w !== undefined; w = work.pop()) {
    if (sites.has(w.adr) || input.stops.has(w.adr) || w.depth >= STATIC_RUN) continue;
    const d = decode(input, w.image, w.adr, w.m, w.x);
    if (d === null || NOT_CODE.has(d.op)) continue;
    const site: Site = { ...d, m: w.m, x: w.x, traced: false, smc: false, variants: new Set([d.bytes.join(',')]), image: w.image };
    sites.set(w.adr, site);
    added += 1;
    if (d.op === 0x28 || d.op === 0xfb) continue;
    const r = successors(w.adr, site);
    if (BRANCH.has(d.op) || d.op === 0x80 || d.op === 0x82) {
      for (const t of r.targets) work.push({ adr: t, m: r.m, x: r.x, depth: w.depth + 1, image: w.image });
    }
    if (r.falls) work.push({ adr: r.next, m: r.m, x: r.x, depth: w.depth + 1, image: w.image });
  }
  return added;
};

export { extendStatically, successors };
