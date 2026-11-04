/* @layer shared-asset-extraction @kind logic */
import type { Sprite } from '../shared/oam-decode';
import { MON } from './anim-sprites.constants';
import { decodeOam } from '../shared/oam-decode';

const fromHex = (s: string): Uint8Array => Uint8Array.from(s.match(/../g) ?? [], (b) => parseInt(b, 16));

const parseMonitor = (lines: string[]): Map<number, Sprite[]> => {
  const frames = new Map<number, Sprite[]>();
  for (const raw of lines) {
    const m = MON.exec(raw.replace(/\*/g, ' '));
    if (!m) continue;
    const a = fromHex(m[2] as string);
    const b = fromHex(m[3] as string);
    const blob = new Uint8Array(a.length + b.length);
    blob.set(a, 0);
    blob.set(b, a.length);
    frames.set(Number(m[1]), decodeOam(blob));
  }
  return frames;
};

export { parseMonitor };
