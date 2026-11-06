/* @layer bridge-wasm @kind constants */
import type { CtOptionKey } from '../world/ct-world-keys.type';

const CT_AP_EXCLUDED_OPTIONS: readonly CtOptionKey[] = ['mysterySeed'];

const CT_AP_LOCKED_PARTY = 'crono,marle';

const CT_AP_LOCKED_OPTIONS: Readonly<Partial<Record<CtOptionKey, { baseline: boolean | string; label: string }>>> = {
  characterRando: { baseline: false, label: 'Character randomization' },
  duplicateCharacters: { baseline: false, label: 'Duplicate characters' },
  bucketList: { baseline: false, label: 'Bucket List' },
  partyMode: { baseline: 'custom', label: 'Starting party' },
};

export { CT_AP_EXCLUDED_OPTIONS, CT_AP_LOCKED_OPTIONS, CT_AP_LOCKED_PARTY };
