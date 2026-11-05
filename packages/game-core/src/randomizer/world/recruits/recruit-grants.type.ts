/* @layer bridge-wasm @kind type */
import type { CharacterAssignment } from './character-assignment.type';

type RecruitGrants = { assignment?: CharacterAssignment | undefined; duplicate?: boolean };

export type { RecruitGrants };
