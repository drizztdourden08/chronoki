/* @layer shared-types @kind types */
interface Profile {
  id: string;
  name: string;
  romFile: string;
  msuPack?: string;
  created: number;
  lastPlayed: number;
}

interface CreateProfileOptions {
  name: string;
  romFile: string;
  initialConfig?: Record<string, unknown>;
}

type CreateProfileResult =
  | { success: true; profile: Profile }
  | { success: false; error: string; code?: string };

interface AppState {
  lastProfileId: string | null;
  firstRun?: boolean;
}

export type { AppState, CreateProfileOptions, CreateProfileResult, Profile };
