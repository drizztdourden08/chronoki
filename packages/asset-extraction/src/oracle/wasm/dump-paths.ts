/* @layer shared-asset-extraction @kind logic */
import { DUMP_EXT } from './peek-calls.constants';

const dumpPaths = (base: string): string[] => DUMP_EXT.map((e) => `${base}${e}`);

export { dumpPaths };
