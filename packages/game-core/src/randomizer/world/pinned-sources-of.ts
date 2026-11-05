/* @layer bridge-wasm @kind logic */
import type { CtKeyItem, CtRegionId } from './ct-world-keys.type';
import type { PinnedSource } from './pinned-source.type';
import { PINNED_SOURCES } from './pinned-sources.constants';

const pinnedSourcesOf = (keyItems: readonly CtKeyItem[], kept: ReadonlySet<CtRegionId>): PinnedSource[] =>
  PINNED_SOURCES.filter((source) => keyItems.includes(source.item) && source.needs.every((id) => kept.has(id)));

export { pinnedSourcesOf };
