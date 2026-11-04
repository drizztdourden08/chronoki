/* @layer shared-asset-extraction @kind logic */
import type { TableAbi } from '../tables/table-abi.type';
import { ABIS } from './repack-main.constants';

interface RequiredImportArgs {
  rom: string;
  belthasar: string;
  out: string;
  abi: TableAbi;
}

const requiredImportArgs = (values: { rom?: string; belthasar?: string; out?: string; abi?: string }): RequiredImportArgs | null => {
  const abi = ABIS[values.abi ?? ''];
  if (values.rom === undefined || values.belthasar === undefined || values.out === undefined || abi === undefined) return null;
  return { rom: values.rom, belthasar: values.belthasar, out: values.out, abi };
};

export { requiredImportArgs };
