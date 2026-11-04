/* @layer shared-asset-extraction @kind logic */
const N = 20;

interface ItemFx {
  kind: number[];
  amt: number[];
  allp: number[];
  pool: number[];
}

const word = (rom: Uint8Array, at: number): number => (rom[at] as number) | ((rom[at + 1] as number) << 8);

const expectBytes = (rom: Uint8Array, at: number, want: number[], what: string): void => {
  if (want.some((b, i) => rom[at + i] !== b)) throw new Error(`menu_itemuse: ${what}`);
};

/** C2/B0FA: X = 0; ASL until a carry, X += 2, while X < 0A. The handler address the kind byte selects. */
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

/** The consumables 0xBC..0xCF decoded the way C2/B0AB does it (prop: the oracle's $7E:7700 table). */
const itemFx = (rom: Uint8Array, prop: Uint8Array): ItemFx => {
  const kind = new Array<number>(N).fill(0);
  const amt = new Array<number>(N).fill(0);
  const allp = new Array<number>(N).fill(0);
  const pool = new Array<number>(N).fill(0);
  // C2/B10D's first arm (X = 0): LDA #C2 / STA $0DBD / LDA #40 / STA $0DC0
  const a = 0x20000 + word(rom, 0x2b141);
  expectBytes(rom, a, [0xa9], 'C2/B10D arm 0 ($0DBD)');
  expectBytes(rom, a + 2, [0x8d, 0xbd, 0x0d], 'C2/B10D arm 0 ($0DBD)');
  expectBytes(rom, a + 5, [0xa9], 'C2/B10D arm 0 ($0DC0)');
  expectBytes(rom, a + 7, [0x8d, 0xc0, 0x0d], 'C2/B10D arm 0 ($0DC0)');
  const pmBits = rom[a + 1] as number;
  const pmDc0 = rom[a + 6] as number;
  for (let s = 0; s < N; s += 1) {
    const b0 = rom[0x0c05cc + s * 4] as number;
    const b1 = rom[0x0c05cc + s * 4 + 1] as number;
    const b2 = rom[0x0c05cc + s * 4 + 2] as number;
    const b3 = rom[0x0c05cc + s * 4 + 3] as number;
    const scope = ((((rom[0x0c1bb5 + s] as number) + 1) & 3) << 2);
    allp[s] = scope & 8 ? 1 : 0;
    let dbd = b1;
    let dc0 = (b2 & 0x0f) === 0x0f ? 0x40 : b2 & 0x0f;
    const handler = handlerOf(rom, b0);
    if (handler === 0xb107) {
      dbd = pmBits;
      dc0 = pmDc0;
    }
    if (handler === 0xb1f8) {
      // C2/B1F8 `LDA #CA / STA $0DBD / JMP C2/B18B`: the restore path past C2/B17F's $0DBF store.
      const sh = 0x20000 + 0xb1f8;
      expectBytes(rom, sh, [0xa9], 'C2/B1F8 ($0DBD)');
      expectBytes(rom, sh + 2, [0x8d, 0xbd, 0x0d], 'C2/B1F8 ($0DBD)');
      dbd = rom[sh + 1] as number;
    }
    pool[s] = (dbd & 0x80 ? 1 : 0) | (dbd & 0x40 ? 2 : 0);
    if (!((prop[0xbc + s] as number) & 0x02)) continue;
    if (handler === 0xb17f || handler === 0xb107 || handler === 0xb1f8) {
      if (dc0 === 0x40) kind[s] = 3;
      else if (dbd & 0x80) [kind[s], amt[s]] = [1, (b3 & 0x3f) * dc0];
      else if (dbd & 0x40) [kind[s], amt[s]] = [2, (b3 & 0x3f) * dc0];
    } else if (handler === 0xb200) {
      // C2/B200: CD -> power, CE -> magic, else speed
      const id = 0xbc + s;
      [kind[s], amt[s]] = [4, id === 0xcd ? 0 : id === 0xce ? 1 : 2];
    }
  }
  return { kind, amt, allp, pool };
};

export { itemFx, N };
export type { ItemFx };
