/* @layer shared-asset-extraction @kind types */
interface Operand {
  o: string;
  t: number | null;
}

interface OperandSite {
  k: number;
  pc: number;
  ob: number[];
}

type Form = (val: number, ob: number[]) => string;

export type { Form, Operand, OperandSite };
