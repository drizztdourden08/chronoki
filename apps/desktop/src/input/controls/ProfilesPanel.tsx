/* @layer renderer-components @kind component */
import { Box, Icon, IconButton } from '@drizztdourden08/tessera/primitives';
import { SidePanel } from '@drizztdourden08/tessera/composites';
import { ProfileItem } from './ProfileItem';
import { PROFILES_DEFAULT_FOLDED, PROFILES_FOLD_KEY, SIDE_PANEL_SIZE } from './controls.constants';
import { sideSlotClass } from './side-slot-class';
import { useFoldWhenNarrow } from './useFoldWhenNarrow';
import type { ProfilesPanelProps } from './ProfilesPanel.type';

const ProfilesPanel = ({ ctrl, onDelete, narrow }: ProfilesPanelProps) => {
  const { collapsed, setCollapsed, expand } = useFoldWhenNarrow(PROFILES_FOLD_KEY, PROFILES_DEFAULT_FOLDED, narrow);
  const handleAdd = () => {
    expand();
    ctrl.create();
  };
  return (
  <Box className={sideSlotClass('start', collapsed)}>
  <SidePanel
    title="Profiles"
    {...SIDE_PANEL_SIZE}
    storageKey="controls:profiles-width"
    collapsed={collapsed}
    onCollapsedChange={setCollapsed}
    railItems={ctrl.profiles.map((profile) => (
      <IconButton
        key={profile.id}
        variant="ghost"
        size="sm"
        active={profile.id === ctrl.activeProfile?.id}
        label={profile.name}
        onClick={() => ctrl.select(profile)}
      >
        <Icon name={profile.deviceType === 'keyboard' ? 'keyboard' : 'gamepad-2'} />
      </IconButton>
    ))}
    action={(
      <IconButton variant="ghost" size="sm" label="New profile" onClick={handleAdd}>
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
  </Box>
  );
};

export { ProfilesPanel };
