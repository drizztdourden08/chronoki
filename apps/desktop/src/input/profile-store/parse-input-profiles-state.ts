/* @layer renderer-lib @kind logic */
import { KEYBOARD_DEFAULT, parseInputProfiles, profileFromPreset } from '@chronoki/input-mapping';
import type { FunctionMapping } from '@chronoki/input-mapping';
import { mergeFunctionMappings } from './merge-function-mappings';
import type { InputProfilesState } from './input-profiles-state.type';

const asRecord = (raw: unknown): Record<string, unknown> =>
  typeof raw === 'object' && raw !== null && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};

const parseInputProfilesState = (raw: unknown): InputProfilesState => {
  const record = asRecord(raw);
  const parsed = parseInputProfiles(Array.isArray(raw) ? raw : record['profiles']);
  const profiles = parsed.length > 0 ? parsed : [profileFromPreset(KEYBOARD_DEFAULT)];
  const savedActive = typeof record['activeProfileId'] === 'string' ? record['activeProfileId'] : null;
  const activeProfileId = profiles.find((p) => p.id === savedActive)?.id ?? profiles[0]?.id ?? null;
  const saved = Array.isArray(record['functionMappings']) ? (record['functionMappings'] as FunctionMapping[]) : [];
  return { activeProfileId, profiles, functionMappings: mergeFunctionMappings(saved) };
};

export { parseInputProfilesState };
