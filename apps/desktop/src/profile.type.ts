/* @layer renderer-app @kind types */
import type { ProfileCreateExtension, ProfileExtension, ProfilePatchExtension } from '@drizztdourden08/brock-core/augment';

declare module '@drizztdourden08/brock-core/augment' {
  interface ProfileExtension {
    romFile: string;
  }
  interface ProfileCreateExtension {
    romFile?: string;
  }
  interface ProfilePatchExtension {
    romFile?: string;
  }
}

export type { ProfileCreateExtension, ProfileExtension, ProfilePatchExtension };
