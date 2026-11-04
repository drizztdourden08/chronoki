/* @layer shared-asset-extraction @kind logic */
import { DMA_NAMES, REGS } from './disasm-regs.constants';

const regName = (address: number): string | null => {
  const eff = address & 0xffff;
  const plain = REGS[eff];
  if (plain !== undefined) return plain;
  if (eff >= 0x4300 && eff <= 0x437f) {
    const nm = DMA_NAMES[eff & 0xf];
    return nm === undefined ? null : `${nm}${(eff >> 4) & 7}`;
  }
  return null;
};

export { regName };
