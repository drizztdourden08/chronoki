/* @layer shared-asset-extraction @kind logic */
import type { Headers } from '../c-parse/headers.type';
import type { PackTable } from '../pack.type';
import { byName } from './by-name';

const sortedTables = (hs: Headers): PackTable[] => [...hs.tables].sort((a, b) => byName(a.name, b.name));

export { sortedTables };
