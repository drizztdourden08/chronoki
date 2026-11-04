/* @layer shared-asset-extraction @kind logic */
import type { Headers } from '../c-parse/headers.type';
import { PackError } from '../pack-error';
import type { PackDefine } from '../pack.type';
import { COMPILED_IN } from './storage-defines.constants';
import { dimDefines } from './dim-defines';

const compiledIn = (hs: Headers, defines: PackDefine[]): Set<string> => {
  const dims = dimDefines(hs);
  const names = new Set(defines.map((d) => d.name));
  for (const n of Object.keys(COMPILED_IN)) {
    if (!names.has(n)) throw new PackError(`COMPILED_IN names ${n}, which no header defines`);
  }
  return new Set([...names].filter((n) => dims.has(n) || n in COMPILED_IN));
};

export { compiledIn };
