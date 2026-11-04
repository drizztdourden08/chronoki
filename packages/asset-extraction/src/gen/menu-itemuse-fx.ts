/* @layer shared-asset-extraction @kind logic */
import type { ItemFx } from './menu-itemuse-fx.type';
import { ITEM_FX_COUNT } from './menu-itemuse-fx.constants';

const word = (rom: Uint8Array, at: number): number => (rom[at] as number) | ((rom[at + 1] as number) << 8);

const expectBytes = (rom: Uint8Array, at: number, want: number[], what: string): void => {
  if (want.some((b, i) => rom[at + i] !== b)) throw new Error(`menu_itemuse: ${what}`);
};

const handlerOf = (rom: Uint8Array, b0: number): number => {
  let x = 0;
  let v = b0;
  while (x < 10) {
    const c = v & 0x80;
    v = (v << 1) & 0xff;
    if (c) break;
    x += 2;
  }
  return word(rom, 0x2b0ee + x);
};

const powerMealArm = (rom: Uint8Array): { pmBits: number; pmDc0: number } => {
  const a = 0x20000 + word(rom, 0x2b141);
  expectBytes(rom, a, [0xa9], 'C2/B10D arm 0 ($0DBD)');
  expectBytes(rom, a + 2, [0x8d, 0xbd, 0x0d], 'C2/B10D arm 0 ($0DBD)');
  expectBytes(rom, a + 5, [0xa9], 'C2/B10D arm 0 ($0DC0)');
  expectBytes(rom, a + 7, [0x8d, 0xc0, 0x0d], 'C2/B10D arm 0 ($0DC0)');
  return { pmBits: rom[a + 1] as number, pmDc0: rom[a + 6] as number };
};

const slotParams = (
  rom: Uint8Array,
  handler: number,
  bytes: { b1: number; b2: number },
  pm: { pmBits: number; pmDc0: number },
): { dbd: number; dc0: number } => {
  let dbd = bytes.b1;
  let dc0 = (bytes.b2 & 0x0f) === 0x0f ? 0x40 : bytes.b2 & 0x0f;
  if (handler === 0xb107) {
    dbd = pm.pmBits;
    dc0 = pm.pmDc0;
  }
  if (handler === 0xb1f8) {
    const sh = 0x20000 + 0xb1f8;
    expectBytes(rom, sh, [0xa9], 'C2/B1F8 ($0DBD)');
    expectBytes(rom, sh + 2, [0x8d, 0xbd, 0x0d], 'C2/B1F8 ($0DBD)');
    dbd = rom[sh + 1] as number;
  }
  return { dbd, dc0 };
};

const b200Amount = (id: number): number => {
  if (id === 0xcd) return 0;
  if (id === 0xce) return 1;
  return 2;
};

const healEffect = (dbd: number, dc0: number, b3: number): [number, number] => {
  if (dc0 === 0x40) return [3, 0];
  if (dbd & 0x80) return [1, (b3 & 0x3f) * dc0];
  if (dbd & 0x40) return [2, (b3 & 0x3f) * dc0];
  return [0, 0];
};

const slotEffect = (handler: number, params: { dbd: number; dc0: number }, b3: number, s: number): [number, number] => {
  if (handler === 0xb17f || handler === 0xb107 || handler === 0xb1f8) return healEffect(params.dbd, params.dc0, b3);
  if (handler === 0xb200) return [4, b200Amount(0xbc + s)];
  return [0, 0];
};

const itemFx = (rom: Uint8Array, prop: Uint8Array): ItemFx => {
  const kind = new Array<number>(ITEM_FX_COUNT).fill(0);
  const amt = new Array<number>(ITEM_FX_COUNT).fill(0);
  const allp = new Array<number>(ITEM_FX_COUNT).fill(0);
  const pool = new Array<number>(ITEM_FX_COUNT).fill(0);
  const pm = powerMealArm(rom);
  for (let s = 0; s < ITEM_FX_COUNT; s += 1) {
    const b0 = rom[0x0c05cc + s * 4] as number;
    const b1 = rom[0x0c05cc + s * 4 + 1] as number;
    const b2 = rom[0x0c05cc + s * 4 + 2] as number;
    const b3 = rom[0x0c05cc + s * 4 + 3] as number;
    const scope = (((rom[0x0c1bb5 + s] as number) + 1) & 3) << 2;
    allp[s] = scope & 8 ? 1 : 0;
    const handler = handlerOf(rom, b0);
    const params = slotParams(rom, handler, { b1, b2 }, pm);
    pool[s] = (params.dbd & 0x80 ? 1 : 0) | (params.dbd & 0x40 ? 2 : 0);
    if (!((prop[0xbc + s] as number) & 0x02)) continue;
    [kind[s], amt[s]] = slotEffect(handler, params, b3, s);
  }
  return { kind, amt, allp, pool };
};

export { itemFx };
