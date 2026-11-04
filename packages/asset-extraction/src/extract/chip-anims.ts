/* @layer shared-asset-extraction @kind logic */
import { u16 } from './rom-read';

const ANIM_PTRS = 0x3df290;
const ANIM_REL = 0x3df310;
const ANIM_END = 0x3df9cc;
const CHIP_DUR: Record<number, number> = { 0x10: 16, 0x20: 12, 0x40: 8, 0x80: 4 };

/** [dest chip, source chip per frame, ticks per frame] */
type ChipAnim = [dest: number, srcs: number[], durs: number[]];

/** maps.chip_anim_data: the raw chip-animation block for tileset `index`. */
const chipAnimData = (rom: Uint8Array, index: number): Uint8Array => {
  const addrs: number[] = [];
  for (let i = 0; i < 64; i += 1) addrs.push(u16(rom, ANIM_PTRS + i * 2) + ANIM_REL);
  const sizes = addrs.map((a) => Math.min(...addrs.filter((b) => b > a), ANIM_END) - a);
  const a = addrs[index]!;
  const n = sizes[index]!;
  return n > 0 ? rom.slice(a, a + n) : new Uint8Array(0);
};

/** maps.parse_chip_anims: each anim covers 4 chips. */
const parseChipAnims = (data: Uint8Array): ChipAnim[] => {
  const anims: ChipAnim[] = [];
  let i = 0;
  while (i < data.length) {
    const fc = data[i]!;
    i += 1;
    if (fc === 0 || fc === 0x80) break;
    const dest = Math.floor((u16(data, i) - 0x2000) / 16);
    i += 2;
    const durs: number[] = [];
    for (let f = 0; f < fc; f += 1) durs.push(CHIP_DUR[data[i + f]! & 0xf0] ?? 0);
    i += fc;
    const srcs: number[] = [];
    for (let f = 0; f < fc; f += 1) {
      srcs.push(Math.floor((u16(data, i) - 0x6000) / 32));
      i += 2;
    }
    anims.push([dest, srcs, durs]);
  }
  return anims;
};

export { chipAnimData, parseChipAnims };
export type { ChipAnim };
