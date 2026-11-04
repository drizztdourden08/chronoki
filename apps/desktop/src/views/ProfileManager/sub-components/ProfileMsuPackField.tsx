/* @layer renderer-components @kind component */
import { Field, Select } from '@drizztdourden08/tessera/primitives';
import type { Profile } from '@drizztdourden08/brock-core';
import { updateProfile } from '@app/storage/profile-store';
import { NO_PACK_LABEL, PACK_FIELD_HINT } from '../ProfileManager.constants';
import { useMsuPacks } from '../behavior/useMsuPacks';
import { useProfileSettings } from '../behavior/useProfileSettings';

const ProfileMsuPackField = ({ profile }: { profile: Profile }) => {
  const packs = useMsuPacks();
  const locked = useProfileSettings(profile.id)?.vanillaSafe === true;
  const chosen = profile.msuPack ?? '';
  const names = chosen && !packs.includes(chosen) ? [chosen, ...packs] : packs;

  return (
    <Field label="Music pack" hint={locked ? PACK_FIELD_HINT.locked : undefined}>
      <Select
        value={chosen}
        disabled={locked}
        onChange={(msuPack) => void updateProfile(profile.id, { msuPack: msuPack || null })}
        options={[{ value: '', label: NO_PACK_LABEL }, ...names.map((name) => ({ value: name, label: name }))]}
        placeholder={NO_PACK_LABEL}
      />
    </Field>
  );
};

export { ProfileMsuPackField };
