/* @layer shared-asset-extraction @kind logic @source Python rom_closure.world_headers, rom_closure.place_name_ids, rom_closure.world_scripts, rom_closure.world_tables */
import { byteAt, wordAt } from '../bytes/byte-reader';
import { lzCtlibDecompress } from '../lz-ctlib';
import { ptr24 } from './closure-location';
import { until0 } from './menu-lib';
import { animvmWalk, objvmWalk } from './vm-walk';
import type { Span } from './vm-walk';
import type { RomTable } from './closure.type';
import { C6, WORLD_HDRS, WORLD_HDR_LEN, WORLD_PACKET_TABLES, OW_C2_SCRIPTS, OW_C2_ANIMS } from './closure-world.constants';

const C2 = 0x020000;

const hex = (v: number, width: number): string => v.toString(16).toUpperCase().padStart(width, '0');

const packet = (rom: Uint8Array, tableAt: number, index: number): Uint8Array => lzCtlibDecompress(rom, ptr24(rom, C6 + tableAt + 3 * index) as number);

const worldHeaders = (rom: Uint8Array): number[] => Array.from({ length: 8 }, (_, w) => C6 + wordAt(rom, WORLD_HDRS + 2 * w));

const placeNameIds = (rom: Uint8Array): number[] => {
  const ids = new Set<number>([0x6f]);
  for (let w = 0; w < 8; w += 1) ids.add(byteAt(rom, C2 + 0x69f0 + w));
  for (const h of worldHeaders(rom)) {
    const i = byteAt(rom, h + 0x15);
    if (i & 0x80) continue;
    const pk = packet(rom, 0xffc0, i);
    const count = byteAt(pk, 0) || 0x10000;
    for (let k = 0; k < count; k += 1) if (1 + 7 * k + 2 < pk.length) ids.add(pk[1 + 7 * k + 2] as number);
  }
  return [...ids].sort((a, b) => a - b);
};

const worldScripts = (rom: Uint8Array): Span[] => {
  const [spans, data] = objvmWalk(rom, OW_C2_SCRIPTS.map((e): [number, number] => [0xc2, e]));
  for (const h of worldHeaders(rom)) {
    const i = byteAt(rom, h + 0x16);
    if (i & 0x80) continue;
    const blob = packet(rom, 0xffe0, i);
    const mem = new Uint8Array(0x10000);
    mem.set(blob.subarray(0, 0xfc00), 0x400);
    const [s, d] = objvmWalk(rom, [[0x7f, 0x400]], [mem, [0x400, 0x400 + blob.length]]);
    spans.push(...s);
    data.push(...d);
  }
  return [...spans, ...data, ...animvmWalk(rom, OW_C2_ANIMS)];
};

const readerTables = (): RomTable[] => [
  ['BG tilemap rebuild words (C2:0556/055C/0562, layer 0-2)', C2 + 0x0556, C2 + 0x0562 + 4 + 2],
  ['row fade steps (C2:2062)', C2 + 0x2062, C2 + 0x2062 + 0x40],
  ['boarding boxes (C2:324C/3254/325C, 8 bytes)', C2 + 0x324c, C2 + 0x325c + 8],
  ['Epoch velocities (C2:4899/489B)', C2 + 0x4899, C2 + 0x489b + 12 + 2],
  ['Epoch poses (C2:48C5/48C9)', C2 + 0x48c5, C2 + 0x48c9 + 3 + 2],
  ['Epoch boxes (C2:4946/494E, 8 bytes)', C2 + 0x4946, C2 + 0x494e + 8],
  ['Dactyl velocities and poses (C2:5037..5047)', C2 + 0x5037, C2 + 0x5047 + 3 + 2],
  ['Dactyl shadow (C2:508F/5091)', C2 + 0x508f, C2 + 0x5091 + 4 + 2],
  ['Dactyl follower places (C2:543C/543E)', C2 + 0x543c, C2 + 0x543e + 0x1c + 2],
  ['Dactyl follower poses (C2:548C)', C2 + 0x548c, C2 + 0x548c + 7 + 2],
  ['place-name banner frame (C2:57C2 4, C2:57C6 0x19)', C2 + 0x57c2, C2 + 0x57c6 + 0x19],
  ['world map era label places (C2:68E4)', C2 + 0x68e4, C2 + 0x68e4 + 14 + 2],
  ['world map era label ids (C2:69F0)', C2 + 0x69f0, C2 + 0x69f0 + 7 + 2],
  ['time gauge eras (C2:6C97 / C2:6CA5)', C2 + 0x6c97, C2 + 0x6ca5 + 12 + 2],
  ['time gauge needle (C2:6CB3)', C2 + 0x6cb3, C2 + 0x6cb3 + 12 + 2],
  ['time gauge triangle (C2:6F2D)', C2 + 0x6f2d, C2 + 0x6f2d + 5 + 2],
  ['time gauge markers (C2:71DD/71DE, 71EB/71EC)', C2 + 0x71dd, C2 + 0x71ec + 12 + 2],
  ['time gauge VRAM rows (C2:72B8)', C2 + 0x72b8, C2 + 0x72b8 + 32],
  ['time gauge tile list (C2:7321; C2:7360)', C2 + 0x7321, C2 + 0x7360 + 2],
  ['world map marker tiles and palette (C6:F500 0x40, C6:F540 0x21)', C6 + 0xf500, C6 + 0xf540 + 0x21],
  ['world map zoom (C6:F560 / C6:F5A0)', C6 + 0xf560, C6 + 0xf5a0 + 0x3e + 2],
  ['world object counts (C6:F620, C2/2D2D MVN 0x21)', C6 + 0xf620, C6 + 0xf620 + 0x21],
  ['time gauge nybbles (C6:F700, 0x400)', C6 + 0xf700, C6 + 0xf700 + 0x400],
];

const worldTables = (rom: Uint8Array): RomTable[] => {
  const out: RomTable[] = [['world header pointers ($C6:FD00, 8 worlds)', WORLD_HDRS, WORLD_HDRS + 16]];
  worldHeaders(rom).forEach((h, w) => out.push([`world ${w} header (0x17 bytes)`, h, h + WORLD_HDR_LEN]));
  WORLD_PACKET_TABLES.slice(0, -1).forEach((a, k) => {
    out.push([`world packet pointers ($C6:${hex(a, 4)})`, C6 + a, C6 + (WORLD_PACKET_TABLES[k + 1] as number)]);
  });
  out.push(['time gauge packets (C2:7220, 3 x {source, destination})', C2 + 0x7220, C2 + 0x7220 + 12]);
  for (const [a, b] of worldScripts(rom)) out.push([`overworld script ($${hex(0xc0 + (a >> 16), 2)}:${hex(a & 0xffff, 4)})`, a, b]);
  out.push(...readerTables());
  const ids = placeNameIds(rom);
  out.push(['place name pointers ($C6:F400, to the largest id)', C6 + 0xf400, C6 + 0xf400 + 2 * (Math.max(...ids) + 1)]);
  for (const i of ids) {
    const p = C6 + wordAt(rom, C6 + 0xf400 + 2 * i);
    out.push([`place name ${hex(i, 2)}`, p, until0(rom, p)]);
  }
  return out;
};

export { worldTables };
