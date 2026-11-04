/* @layer shared-asset-extraction @kind constants */
const E4 = 0x240000;

const C2 = 0x020000;

const C6 = 0x060000;

const FF = 0x3f0000;

const D1 = 0x110000;

const CD = 0x0d0000;

const SPRITE_RECS: [number, number, number][] = [
  [E4 + 0xf000, 5, Math.floor((0xf600 - 0xf000) / 5)],
  [E4 + 0xf600, 10, Math.floor((0xffe0 - 0xf600) / 10)],
];

const WORLD_PACKET_TABLES = [0xfdf0, 0xfe20, 0xfea0, 0xff00, 0xff20, 0xff40, 0xff80, 0xffa0, 0xffc0, 0xffe0, 0x10000];

const GAUGE_PACKETS: [number, number][] = [[0, 0xc3], [1, 0xc6], [2, 0xc6]];

export { E4, C2, C6, FF, D1, CD, SPRITE_RECS, WORLD_PACKET_TABLES, GAUGE_PACKETS };
