/* @layer renderer-lib @kind types */
import type { PlaySession } from '@drizztdourden08/brock-core';
import type { InputProfile } from '@chronoki/input-mapping';

interface ProfileData {
  saveFiles: number;
  saveBytes: number;
  sramBytes: number | null;
  sessions: PlaySession[];
  inputProfiles: InputProfile[];
  activeInputProfileId: string | null;
}

export type { ProfileData };
