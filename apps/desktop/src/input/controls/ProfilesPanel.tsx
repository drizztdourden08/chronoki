/* @layer renderer-components @kind component */
import { Icon, IconButton } from '@drizztdourden08/tessera/primitives';
import { SidePanel } from '@drizztdourden08/tessera/composites';
import { ProfileItem } from './ProfileItem';
import { SIDE_PANEL_SIZE } from './controls.constants';
import type { ProfilesPanelProps } from './ProfilesPanel.type';

const ProfilesPanel = ({ ctrl, onDelete }: ProfilesPanelProps) => (
  <SidePanel
    title="Profiles"
    {...SIDE_PANEL_SIZE}
    storageKey="controls:profiles-width"
    action={(
      <IconButton variant="ghost" size="sm" label="New profile" onClick={ctrl.create}>
        <Icon name="plus" />
      </IconButton>
    )}
    containers={[{
      title: 'Profile list',
      content: ctrl.profiles.map((profile) => (
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
      )),
    }]}
  />
);

export { ProfilesPanel };
