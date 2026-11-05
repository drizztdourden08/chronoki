/* @layer bridge-wasm @kind logic */
import { PINNED_SOURCES } from './pinned-sources.constants';

const isPinnedPlacement = (location: string, item: string): boolean =>
  PINNED_SOURCES.some((source) => source.key === location && source.item === item);

export { isPinnedPlacement };
