/* @layer shared-asset-extraction @kind logic @source Python maps.chip_anim_data, maps.parse_chip_anims */
import { u16 } from './rom-read';
import { ANIM_PTRS, ANIM_REL, ANIM_END, CHIP_DUR } from './chip-anims.constants';
import type { ChipAnim } from './chip-anims.type';

const chipAnimData = (rom: Uint8Array, index: number): Uint8Array => {
  const addrs: number[] = [];
  for (let i = 0; i < 64; i += 1) addrs.push(u16(rom, ANIM_PTRS + i * 2) + ANIM_REL);
  const sizes = addrs.map((a) => Math.min(...addrs.filter((b) => b > a), ANIM_END) - a);
  const a = addrs[index]!;
  const n = sizes[index]!;
  return n > 0 ? rom.slice(a, a + n) : new Uint8Array(0);
};

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
