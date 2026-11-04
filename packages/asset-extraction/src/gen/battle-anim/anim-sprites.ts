/* @layer shared-asset-extraction @kind logic */
import type { MonitorRequest } from '../../oracle/peek.type';
import type { Sprite } from '../shared/oam-decode';
import { decodeOam } from '../shared/oam-decode';
import { dec } from '../shared/py-format';
import { hex } from '../c-text';
import { BRACKET_TILE } from './anim-consts';

/** mash_bs: "100:16,0:16" repeated up to F frames. */
const mashScript = (F: number, aOn = 16, aOff = 16): string => {
  const seq: string[] = [];
  let n = 0;
  while (n < F) {
    const on = Math.min(aOn, F - n);
    if (on > 0) {
      seq.push(`100:${on}`);
      n += on;
    }
    if (n >= F) break;
    const off = Math.min(aOff, F - n);
    if (off > 0) {
      seq.push(`0:${off}`);
      n += off;
    }
  }
  return seq.length ? seq.join(',') : `0:${F}`;
};

/** hold_bs: one boot-A then hold. */
const holdScript = (F: number, K = 8): string => (F <= K ? `100:${F}` : `100:${K},0:${F - K}`);

const scriptFor = (driver: string, F: number): string => (driver === 'mash' ? mashScript(F) : holdScript(F));

const MON = /^\s*f(\d+)\s+000700=([0-9A-Fa-f]+)\s+000900=([0-9A-Fa-f]+)/;

const fromHex = (s: string): Uint8Array => Uint8Array.from(s.match(/../g) ?? [], (b) => parseInt(b, 16));

/** The OAM shadow per frame of one `--monitor 0700:512,0900:32` run: frame -> decoded sprites. */
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

const MONITOR_REGIONS = '0700:512,0900:32';

const monitorRequest = (state: Uint8Array, script: string): MonitorRequest => ({
  state,
  regions: MONITOR_REGIONS,
  script,
});

const inView = (s: Sprite): boolean => s.y < 210 && s.x > -60 && s.x < 256;

/** combatant(): the on-screen sprites of a palette, bracket dropped, in OAM index order. */
const combatant = (sprites: Sprite[], pal: number): Sprite[] =>
  sprites.filter((s) => inView(s) && s.pal === pal && s.tile !== BRACKET_TILE).sort((a, b) => a.idx - b.idx);

/** cluster_sig(): [anchorX, anchorY, signature] of a palette's on-screen sprites, or null when none. */
const clusterSig = (sprites: Sprite[], pal: number): [number, number, string] | null => {
  const on = sprites.filter((s) => inView(s) && s.pal === pal);
  if (!on.length) return null;
  const ax = Math.min(...on.map((s) => s.x));
  const ay = Math.min(...on.map((s) => s.y));
  const parts = [...on]
    .sort((a, b) => a.tile - b.tile)
    .map((s) => `${hex(s.tile, 3)}@(${s.x - ax},${s.y - ay})${s.vflip ? 'V' : ''}${s.hflip ? 'H' : ''}`);
  return [ax, ay, parts.join(' ')];
};

/** The "{ oidx, x, y, 0xTILE, pal, prio, hf, vf }," line of a CtAnimObj. */
const objLine = (s: Sprite): string =>
  `  { ${dec(s.idx, 3)}, ${dec(s.x, 4)}, ${dec(s.y, 3)}, 0x${hex(s.tile, 3)}, ${s.pal}, ${s.prio}, ${s.hflip}, ${s.vflip} },\n`;

export { clusterSig, combatant, holdScript, inView, mashScript, monitorRequest, objLine, parseMonitor, scriptFor };
