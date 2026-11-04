/* @layer shared-asset-extraction @kind logic @source Python maps.chip_anim_data, maps.parse_chip_anims */
import { u16 } from './u16';
import { ANIM_PTRS, ANIM_REL, ANIM_END } from './chip-anims.constants';

const chipAnimData = (rom: Uint8Array, index: number): Uint8Array => {
  const addrs: number[] = [];
  for (let i = 0; i < 64; i += 1) addrs.push(u16(rom, ANIM_PTRS + i * 2) + ANIM_REL);
  const sizes = addrs.map((a) => Math.min(...addrs.filter((b) => b > a), ANIM_END) - a);
  const a = addrs[index]!;
  const n = sizes[index]!;
  return n > 0 ? rom.slice(a, a + n) : new Uint8Array(0);
};

export { chipAnimData };
export type { ChipAnim };
