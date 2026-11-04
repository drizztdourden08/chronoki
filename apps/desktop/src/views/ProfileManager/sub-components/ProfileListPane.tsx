/* @layer renderer-components @kind component */
import { Button, EmptyState, Icon, IconButton, Stack } from '@drizztdourden08/tessera/primitives';
import { DateText, ListItemRow } from '@drizztdourden08/tessera/composites';
import { PROFILE_TEXT } from '../ProfileManager.constants';
import type { ProfileListPaneProps } from '../ProfileManager.type';

const ProfileListPane = (props: ProfileListPaneProps) => {
  const { profiles, selected, creating, canCreate, onSelect, onOpen, onDelete, onCreate } = props;

  return (
    <Stack gap="xs">
      {canCreate && (
        <Button variant="primary" fullWidth icon={<Icon name="plus" />} disabled={creating} onClick={onCreate}>
          {PROFILE_TEXT.newProfile}
        </Button>
      )}
      {profiles.length === 0 && <EmptyState message={PROFILE_TEXT.empty} />}
      {profiles.map((profile) => (
        <ListItemRow
          key={profile.id}
          icon={<Icon name="user" />}
          name={profile.name}
          meta={
            <>
              {(profile.romFile || PROFILE_TEXT.noRom).replace(/\.(sfc|smc)$/i, '')} ·{' '}
              {profile.lastPlayed ? <DateText value={profile.lastPlayed} format="relative" /> : 'Never'}
            </>
          }
          selected={!creating && selected === profile.id}
          onClick={() => onSelect(profile.id)}
          onDoubleClick={() => onOpen(profile)}
          action={
            <IconButton variant="ghost" size="sm" label={PROFILE_TEXT.delete} onClick={(event) => { event.stopPropagation(); onDelete(profile); }}>
              <Icon name="x" />
            </IconButton>
          }
        />
      ))}
    </Stack>
  );
};

export { ProfileListPane };
