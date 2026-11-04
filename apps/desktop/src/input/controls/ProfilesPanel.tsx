/* @layer renderer-components @kind component */
import { Box, Icon, IconButton, Text } from '@drizztdourden08/tessera/primitives';
import { ProfileItem } from './ProfileItem';
import type { ProfilesPanelProps } from './ProfilesPanel.type';

const ProfilesPanel = ({ ctrl, onDelete }: ProfilesPanelProps) => (
  <Box className="controls-settings__side">
    <Box className="controls-settings__side-header">
      <Text className="controls-settings__section-header">Profiles</Text>
      <IconButton variant="ghost" size="sm" label="New profile" onClick={ctrl.create}>
        <Icon name="plus" />
      </IconButton>
    </Box>
    {ctrl.profiles.map((profile) => (
      <ProfileItem
        key={profile.id}
        profile={profile}
        active={profile.id === ctrl.activeProfile?.id}
        startEditing={profile.id === ctrl.newlyCreatedId}
        canDelete={ctrl.profiles.length > 1}
        onSelect={ctrl.select}
        onRename={ctrl.rename}
        onDelete={onDelete}
      />
    ))}
  </Box>
);

export { ProfilesPanel };
