/* @layer shared-asset-extraction @kind constants */
import { OPCODE_ROWS } from './disasm-table.constants';

const TABLE: ReadonlyArray<readonly [string, string]> = OPCODE_ROWS.split(' ').map((row) => {
  const [mnemonic, mode] = row.split(':');
  return [mnemonic as string, mode as string] as const;
});
if (TABLE.length !== 256) throw new Error(`disasm65816: ${TABLE.length} opcodes`);

export { TABLE };
