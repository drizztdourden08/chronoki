/* @layer shared-types @kind types */
import type { FirstRunMark } from '@drizztdourden08/brock-core';

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
  firstRun?: FirstRunMark;
}

export type { AppState, CreateProfileOptions, CreateProfileResult, Profile };
