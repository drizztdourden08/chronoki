/* @layer bridge-wasm @kind logic */
import type { CoreCalls } from '@drizztdourden08/brock-port-kit';
import type { NameTable } from './game-info.type';
import { cachedName } from './name-cache';

const nameTableOf = (calls: CoreCalls, exportName: string, ids: readonly number[]): NameTable =>
  Object.fromEntries(ids.map((id) => [id, cachedName(calls, exportName, id)]));

export { nameTableOf };
