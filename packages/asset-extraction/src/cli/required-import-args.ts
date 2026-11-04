/* @layer shared-asset-extraction @kind logic */
import { ABIS } from './repack-main.constants';
import type { RequiredImportArgs } from './required-import-args.type';

const requiredImportArgs = (values: { rom?: string; belthasar?: string; out?: string; abi?: string }): RequiredImportArgs | null => {
  const abi = ABIS[values.abi ?? ''];
  if (values.rom === undefined || values.belthasar === undefined || values.out === undefined || abi === undefined) return null;
  return { rom: values.rom, belthasar: values.belthasar, out: values.out, abi };
};

export { requiredImportArgs };
