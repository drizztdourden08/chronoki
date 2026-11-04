/* @layer renderer-components @kind component */
import { Box, Icon, Text } from '@drizztdourden08/tessera/primitives';
import { FunctionGlyph } from '@app/compounds/FunctionGlyph';
import { isFunctionBound } from '@app/input/input-manager/is-function-bound';
import { useGameSession } from '@app/views/GameSession';
import { useProfileSwitcher } from './behavior/useProfileSwitcher';
import './ProfileSwitcherOverlay.css';

const ProfileSwitcherOverlay = () => {
  const { running } = useGameSession();
  const { open, profiles, activeId } = useProfileSwitcher(running);

  return (
    <Box className={`profile-switcher ${open ? 'profile-switcher--open' : ''}`}>
      <Text className="profile-switcher__title">Input Profile</Text>
      <Box className="profile-switcher__list">
        {profiles.map((profile) => (
          <Box
            key={profile.id}
            className={`profile-switcher__item ${profile.id === activeId ? 'profile-switcher__item--active' : ''}`}
          >
            <Text className="profile-switcher__item-icon">
              <Icon name={profile.deviceType === 'keyboard' ? 'keyboard' : 'gamepad-2'} />
            </Text>
            <Text className="profile-switcher__item-name">{profile.name}</Text>
          </Box>
        ))}
      </Box>
      {(isFunctionBound('profile-prev') || isFunctionBound('profile-next')) && (
        <Box className="profile-switcher__hint">
          <FunctionGlyph action="profile-prev" />
          <FunctionGlyph action="profile-next" />
          <Text className="profile-switcher__hint-label">Switch</Text>
        </Box>
      )}
    </Box>
  );
};

export { ProfileSwitcherOverlay };
