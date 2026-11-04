
import { OPCODE_TABLE, FIXED_LENGTH } from './cpu65816.constants';


const operandLength = (mode: string, m: number, x: number): number => {
  if (mode === 'immM') return m ? 1 : 2;
  if (mode === 'immX') return x ? 1 : 2;
  return FIXED_LENGTH[mode] as number;
};

export { OPCODE_TABLE, operandLength };
