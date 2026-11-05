/* @layer bridge-wasm @kind logic */
import type { PackEdit } from '../apply-seed.type';
import type { RomSpace, RomStage } from './tech-order.type';

const createRomStage = (pack: Uint8Array, space: RomSpace): RomStage => {
  const staged = new Map<number, { value: number; why: string }>();
  const put = (addr: number, value: number, why: string): void => {
    staged.set(addr, { value, why });
  };
  const edits = (): PackEdit[] =>
    [...staged.entries()].flatMap(([addr, { value, why }]) =>
      space.locate(addr).filter((at) => pack[at] !== value).map((at) => ({ at, old: pack[at] ?? 0, next: value, why })));
  return { put, edits };
};

export { createRomStage };
