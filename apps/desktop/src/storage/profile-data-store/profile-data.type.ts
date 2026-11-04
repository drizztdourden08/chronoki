/* @layer renderer-lib @kind types */
import type { PlaySession } from '@drizztdourden08/brock-core';

interface ProfileData {
  saveFiles: number;
  saveBytes: number;
  sramBytes: number | null;
  sessions: PlaySession[];
}

export type { ProfileData };
