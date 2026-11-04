/* @layer bridge-wasm @kind type */
import type { Region, WorldLocation } from '@drizztdourden08/brock-randomizer/world';
import type { CtWorldKeys } from './ct-world-keys.type';

type CtJoinedWorld = {
  regions: Region<CtWorldKeys>[];
  treasure: WorldLocation<CtWorldKeys>[];
};

export type { CtJoinedWorld };
