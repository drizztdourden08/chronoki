/* @layer shared-types @kind types */
type ProfileMode = 'original' | 'enhanced';

interface Profile {
  id: string;
  name: string;
  romFile: string;
  created: number;
  lastPlayed: number;
  mode: ProfileMode;
}

interface CreateProfileOptions {
  name: string;
  romFile: string;
  mode?: ProfileMode;
}

type CreateProfileResult =
  | { success: true; profile: Profile }
  | { success: false; error: string; code?: string };

interface AppState {
  lastProfileId: string | null;
  firstRun?: boolean;
}

export type { AppState, CreateProfileOptions, CreateProfileResult, Profile, ProfileMode };
