/* @layer renderer-app @kind types */
import type { ProfileCreateExtension, ProfileExtension, ProfilePatchExtension } from '@drizztdourden08/brock-core/augment';

declare module '@drizztdourden08/brock-core/augment' {
  interface ProfileExtension {
    romFile: string;
    msuPack?: string;
  }
  interface ProfileCreateExtension {
    romFile?: string;
    msuPack?: string;
  }
  interface ProfilePatchExtension {
    romFile?: string;
    msuPack?: string | null;
  }
}

export type { ProfileCreateExtension, ProfileExtension, ProfilePatchExtension };
