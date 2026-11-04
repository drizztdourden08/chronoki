/* @layer renderer-app @kind types */
import type { ProfileCreateExtension, ProfileExtension, ProfilePatchExtension } from '@drizztdourden08/brock-core/augment';
import type { ProfileMode } from '@app/profiles/types';

declare module '@drizztdourden08/brock-core/augment' {
  interface ProfileExtension {
    romFile: string;
    mode: ProfileMode;
  }
  interface ProfileCreateExtension {
    romFile?: string;
    mode?: ProfileMode;
  }
  interface ProfilePatchExtension {
    romFile?: string;
    mode?: ProfileMode;
  }
}

export type { ProfileCreateExtension, ProfileExtension, ProfilePatchExtension };
