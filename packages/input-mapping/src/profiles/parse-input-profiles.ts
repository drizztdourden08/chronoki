/* @layer shared-input @kind logic */
import type { InputProfile } from './profiles.type';

const isProfile = (value: unknown): value is InputProfile => {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<InputProfile>;
  return typeof candidate.id === 'string' && typeof candidate.name === 'string' && Array.isArray(candidate.mappings);
};

const parseInputProfiles = (raw: unknown): InputProfile[] => (Array.isArray(raw) ? raw.filter(isProfile) : []);

export { parseInputProfiles };
