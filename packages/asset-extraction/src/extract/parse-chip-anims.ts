/* @layer shared-asset-extraction @kind logic */
import type { ChipAnim } from './chip-anims.type';
import { u16 } from './u16';
import { CHIP_DUR } from './chip-anims.constants';

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

export { parseChipAnims };
