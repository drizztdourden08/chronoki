/* @layer shared-asset-extraction @kind logic */
import { FIXED_LENGTH } from './disasm-table.constants';

const opLen = (mode: string, m: number, x: number): number => {
  if (mode === 'immM') return m ? 1 : 2;
  if (mode === 'immX') return x ? 1 : 2;
  return FIXED_LENGTH[mode] as number;
};

export { opLen };
