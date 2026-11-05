/* @layer bridge-wasm @kind type */
import type { CtRule } from './ct-region-spec.type';
import type { CtKeyItem, CtRegionId } from './ct-world-keys.type';

type PinnedSource = {
  key: string;
  item: CtKeyItem;
  region: CtRegionId;
  mapId: number;
  name: string;
  rule: CtRule;
  needs: readonly CtRegionId[];
};

export type { PinnedSource };
