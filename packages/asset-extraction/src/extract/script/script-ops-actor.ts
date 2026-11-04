/* @layer shared-asset-extraction @kind logic */
import { byteAt } from '../bytes/byte-reader';
import { LOC, PARTY } from './script-mem';
import type { OpHandler, RunCtx } from './script-run.type';

/** The seven one-byte PC loaders that hardwire their char id (the mapping is not monotonic in the opcode). */
const PC_LOADERS: [number, number][] = [
  [0x57, 0],
  [0x5c, 1],
  [0x62, 2],
  [0x6a, 3],
  [0x68, 4],
  [0x6c, 5],
  [0x6d, 6],
];

const b = (c: RunCtx, addr: number, k: number): number => byteAt(c.body, addr + k);

/** script._pos_words: the placement's WRAM words ($1800/$1880 + 2 obj, low then high). */
const posWords = (c: RunCtx, wx: number, wy: number): void => {
  const x = c.obj * 2;
  c.mem.s[0x1800 + x] = wx & 0xff;
  c.mem.s[0x1801 + x] = (wx >> 8) & 0xff;
  c.mem.s[0x1880 + x] = wy & 0xff;
  c.mem.s[0x1881 + x] = (wy >> 8) & 0xff;
};

/** script._pc_lead_arm: C0/42B3 STX $97 and the lead's arrival arm (tile from $0102/$0103, half-tile bytes from $0104). */
const pcLeadArm = (c: RunCtx): void => {
  const { s } = c.mem;
  const x = c.obj * 2;
  s[0x0197] = x & 0xff;
  s[0x0198] = 0;
  const b4 = s[0x0104] as number;
  s[0x1801 + x] = s[0x0102] as number;
  s[0x1881 + x] = s[0x0103] as number;
  s[0x1880 + x] = b4 & 0x08 ? 0x7f : 0xff;
  s[0x1800 + x] = b4 & 0x04 ? 0x00 : 0x80;
};

/** Op 0x80 and the seven PC loaders: define the sprite; an in-party slot 0 also arms the lead. */
const loadChar =
  (fixed: number | null): OpHandler =>
  (c, addr, nxt) => {
    const cid = fixed ?? b(c, addr, 1);
    c.a.sprite = cid;
    c.a.defined = true;
    if (cid === PARTY[0]) {
      c.a.draw = 'draw';
      c.a.dead = false;
      pcLeadArm(c);
    }
    return nxt;
  };

/** Ops 0x81-0x83, the NPC/monster loaders: they do not write the visibility byte. */
const loadSprite =
  (plus: number): OpHandler =>
  (c, addr, nxt) => {
    c.a.sprite = b(c, addr, 1) + plus;
    c.a.defined = true;
    c.a.dead = false;
    return nxt;
  };

const setFacing =
  (face: number | null): OpHandler =>
  (c, addr, nxt) => {
    c.a.facing = face ?? b(c, addr, 1);
    return nxt;
  };

const targetDraw =
  (mode: 'draw' | 'hidden'): OpHandler =>
  (c, addr, nxt) => {
    const t = b(c, addr, 1) >> 1;
    const target = c.actors[t];
    if (target) target.draw = mode;
    return nxt;
  };

const selfDraw =
  (mode: 'draw' | 'hidden' | 'removed'): OpHandler =>
  (c, _addr, nxt) => {
    c.a.draw = mode;
    return nxt;
  };

/** The actor-state ops: sprite loads, coordinates, facing, draw state. Animation ops (0xAA..0xB7) change nothing the packers read. */
const ACTOR_OPS: [number, OpHandler][] = [
  ...PC_LOADERS.map(([op, id]): [number, OpHandler] => [op, loadChar(id)]),
  [0x80, loadChar(null)],
  [0x81, loadSprite(0)],
  [0x82, loadSprite(7)],
  [0x83, loadSprite(256)],
  [
    0x8b,
    (c, addr, nxt) => {
      c.a.pos = [b(c, addr, 1) * 16 + 8, b(c, addr, 2) * 16 + 16];
      posWords(c, b(c, addr, 1) * 256 + 0x80, b(c, addr, 2) * 256 + 0xff);
      return nxt;
    },
  ],
  [
    0x8c,
    (c, addr, nxt) => {
      const x = c.obj * 2;
      const tx = c.mem.r8(LOC + b(c, addr, 1) * 2);
      const ty = c.mem.r8(LOC + b(c, addr, 2) * 2);
      c.mem.s[0x1801 + x] = tx;
      c.mem.s[0x1881 + x] = ty;
      c.mem.s[0x1880 + x] = 0xff;
      c.a.pos = [((tx << 8) | (c.mem.s[0x1800 + x] as number)) >> 4, (((ty << 8) | 0xff) + 1) >> 4];
      return nxt;
    },
  ],
  [
    0x8d,
    (c, addr, nxt) => {
      const wx = b(c, addr, 1) | (b(c, addr, 2) << 8);
      const wy = b(c, addr, 3) | (b(c, addr, 4) << 8);
      c.a.pos = [wx >> 4, wy >> 4];
      posWords(c, wx, wy);
      return nxt;
    },
  ],
  [
    0x21,
    (c, addr, nxt) => {
      const x = b(c, addr, 1);
      c.mem.w8(LOC + b(c, addr, 2) * 2, c.mem.s[(0x1801 + x) & 0xffff] as number);
      c.mem.w8(LOC + b(c, addr, 3) * 2, c.mem.s[(0x1881 + x) & 0xffff] as number);
      return nxt;
    },
  ],
  [
    0x22,
    (c, addr, nxt) => {
      const x = c.mem.s[0x0197 + b(c, addr, 1)] as number;
      c.mem.w8(LOC + b(c, addr, 2) * 2, c.mem.s[(0x1801 + x) & 0xffff] as number);
      c.mem.w8(LOC + b(c, addr, 3) * 2, c.mem.s[(0x1881 + x) & 0xffff] as number);
      return nxt;
    },
  ],
  [0x0f, setFacing(0)],
  [0x17, setFacing(1)],
  [0x1b, setFacing(2)],
  [0x1d, setFacing(3)],
  [0xa6, setFacing(null)],
  [0x90, selfDraw('draw')],
  [0x91, selfDraw('hidden')],
  [0x7e, selfDraw('removed')],
  [0x7c, targetDraw('draw')],
  [0x7d, targetDraw('hidden')],
  [
    0x0a,
    (c, addr, nxt) => {
      const target = c.actors[b(c, addr, 1) >> 1];
      if (target) {
        target.dead = true;
        target.draw = 'hidden';
      }
      return nxt;
    },
  ],
];

export { ACTOR_OPS };
