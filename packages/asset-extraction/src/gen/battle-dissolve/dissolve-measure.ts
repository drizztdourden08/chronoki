/* @layer shared-asset-extraction @kind logic */
import { KEY_ORDER } from './dissolve-sprite';

type Seq = Map<number, number[]>;

const at = (seq: Seq, n: number): number[] => seq.get(n) as number[];
const fmt = (k: number): string => `(${k % 32}, ${Math.floor(k / 32)})`;

const findStart = (seq: Seq, frames: number[]): number => {
  for (let i = 1; i < frames.length; i += 1) {
    const a = at(seq, frames[i - 1] as number);
    const b = at(seq, frames[i] as number);
    const cleared = KEY_ORDER.some((k) => a[k] && !b[k]);
    const changed = KEY_ORDER.some((k) => b[k] && b[k] !== a[k]);
    if (cleared && !changed) return frames[i - 1] as number;
  }
  throw new Error(`battle_dissolve: no dissolve in peek frames ${frames[0]}..${frames[frames.length - 1]}`);
};

const measure = (seq: Seq): { start: number; dither: number[][] } => {
  const frames = [...seq.keys()].sort((a, b) => a - b);
  const lastFrame = frames[frames.length - 1] as number;
  const start = findStart(seq, frames);
  const base = at(seq, start);
  const last = new Map<number, number>();
  for (const k of KEY_ORDER) {
    const v = base[k] as number;
    if (!v) continue;
    let n = start;
    while (seq.has(n + 1) && (at(seq, n + 1)[k] as number) === v) n += 1;
    if (!seq.has(n + 1)) throw new Error(`battle_dissolve: pixel ${fmt(k)} still present at the window end`);
    for (let m = n + 1; m <= lastFrame; m += 1) {
      if (at(seq, m)[k]) throw new Error(`battle_dissolve: pixel ${fmt(k)} comes back after it cleared`);
    }
    last.set(k, n - start);
  }
  const dither: (number | null)[][] = Array.from({ length: 8 }, () => new Array(8).fill(null));
  for (const [k, step] of last) {
    const gx = k % 32;
    const gy = Math.floor(k / 32);
    const row = dither[gy % 8] as (number | null)[];
    const c = row[gx % 8] as number | null;
    if (c !== null && c !== step) {
      throw new Error(`battle_dissolve: cell (${gx % 8},${gy % 8}) disagrees: step ${c} and ${step}`);
    }
    row[gx % 8] = step;
  }
  if (dither.some((row) => row.some((v) => v === null))) {
    throw new Error('battle_dissolve: a dither cell has no inked pixel to measure it');
  }
  return { start, dither: dither as number[][] };
};

const verifyBad = (seq: Seq, start: number, dither: number[][]): { bad: number; tot: number } => {
  const base = at(seq, start);
  let bad = 0;
  let tot = 0;
  for (const n of [...seq.keys()].sort((a, b) => a - b)) {
    if (n < start) continue;
    const step = n - start;
    const cur = at(seq, n);
    for (const k of KEY_ORDER) {
      const v = base[k] as number;
      const cell = (dither[Math.floor(k / 32) % 8] as number[])[(k % 32) % 8] as number;
      tot += 1;
      if ((cell >= step ? v : 0) !== cur[k]) bad += 1;
    }
  }
  return { bad, tot };
};

export type { Seq };
export { measure, verifyBad };
