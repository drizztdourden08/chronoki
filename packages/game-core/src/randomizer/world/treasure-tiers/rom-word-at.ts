/* @layer bridge-wasm @kind logic */
import type { RomView } from '../../checks/create-pack-rom-view.type';

const romWordAt = (view: RomView, rom: number): number | null => {
  const lo = view(rom);
  const hi = view(rom + 1);
  return lo === null || hi === null ? null : lo | (hi << 8);
};

export { romWordAt };
