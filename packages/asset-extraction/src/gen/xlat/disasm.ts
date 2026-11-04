/* @layer shared-asset-extraction @kind logic */
import { regName } from './disasm-regs';
import { FIXED_LENGTH, OPCODE_ROWS } from './disasm-table';

const TABLE: ReadonlyArray<readonly [string, string]> = OPCODE_ROWS.split(' ').map((row) => {
  const [mnemonic, mode] = row.split(':');
  return [mnemonic as string, mode as string] as const;
});
if (TABLE.length !== 256) throw new Error(`disasm65816: ${TABLE.length} opcodes`);

const opLen = (mode: string, m: number, x: number): number => {
  if (mode === 'immM') return m ? 1 : 2;
  if (mode === 'immX') return x ? 1 : 2;
  return FIXED_LENGTH[mode] as number;
};

const hex = (value: number, digits: number): string => value.toString(16).toUpperCase().padStart(digits, '0');

interface Operand {
  o: string;
  t: number | null;
}

const plain = (o: string): Operand => ({ o, t: null });

const operandText = (mode: string, k: number, pc: number, ob: number[], val: number): Operand => {
  const h2 = hex(val, 2);
  const h4 = hex(val, 4);
  switch (mode) {
    case 'immM':
    case 'immX':
    case 'imm8': return plain(ob.length === 1 ? `#$${h2}` : `#$${h4}`);
    case 'imp': return plain('');
    case 'acc': return plain('A');
    case 'dp': return plain(`$${h2}`);
    case 'dpx': return plain(`$${h2},X`);
    case 'dpy': return plain(`$${h2},Y`);
    case 'idp': return plain(`($${h2})`);
    case 'idx': return plain(`($${h2},X)`);
    case 'idy': return plain(`($${h2}),Y`);
    case 'idl': return plain(`[$${h2}]`);
    case 'idly': return plain(`[$${h2}],Y`);
    case 'sr': return plain(`$${h2},S`);
    case 'isy': return plain(`($${h2},S),Y`);
    case 'abs': return plain(`$${h4}`);
    case 'abx': return plain(`$${h4},X`);
    case 'aby': return plain(`$${h4},Y`);
    case 'abl': return plain(`$${hex(val, 6)}`);
    case 'alx': return plain(`$${hex(val, 6)},X`);
    case 'ind': return plain(`($${h4})`);
    case 'iax': return plain(`($${h4},X)`);
    case 'ial': return plain(`[$${h4}]`);
    case 'bm': return plain(`$${hex(ob[0] as number, 2)},$${hex(ob[1] as number, 2)}`);
    case 'rel': {
      const t = (k << 16) | ((pc + 2 + (val < 0x80 ? val : val - 0x100)) & 0xffff);
      return { o: `$${hex(t & 0xffff, 4)}`, t };
    }
    case 'rell': {
      const t = (k << 16) | ((pc + 3 + (val < 0x8000 ? val : val - 0x10000)) & 0xffff);
      return { o: `$${hex(t & 0xffff, 4)}`, t };
    }
    default: return plain('?');
  }
};

const fmt = (mnem: string, mode: string, k: number, pc: number, ob: number[]): [string, number | null, string | null] => {
  let val = 0;
  ob.forEach((by, i) => {
    val += by * 2 ** (8 * i);
  });
  const { o, t } = operandText(mode, k, pc, ob, val);
  let reg: string | null = null;
  if (mode === 'dp' || mode === 'dpx' || mode === 'dpy') reg = regName(val & 0xffff);
  else if (mode === 'abs' || mode === 'abx' || mode === 'aby') reg = regName(val);
  return [mnem + (o ? ` ${o}` : ''), t, reg];
};

export { fmt, opLen, TABLE };
