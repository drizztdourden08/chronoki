/* @layer renderer-components @kind component */
import { Box, Icon, Text } from '@drizztdourden08/tessera/primitives';
import { MANUAL_PAUSE } from '@chronoki/input-mapping';
import { FunctionGlyph } from '@app/compounds/FunctionGlyph';
import { getInputManager } from '@app/input/input-manager/get-input-manager';
import { isFunctionBound } from '@app/input/input-manager/is-function-bound';
import { useGameSession } from '@app/views/GameSession';
import './PauseOverlay.css';

const PauseOverlay = () => {
  const { paused } = useGameSession();
  if (!paused) return null;
  const manager = getInputManager();
  const name = manager.pauseManager.controllerName;
  const disconnected = name !== '' && name !== MANUAL_PAUSE;

  if (!disconnected) {
    return (
      <Box className="pause-overlay">
        <Box className="pause-overlay__bars">
          <Box className="pause-overlay__bar" />
          <Box className="pause-overlay__bar" />
        </Box>
      </Box>
    );
  }

  return (
    <Box className="pause-overlay" onDoubleClick={() => manager.resume()}>
      <Box className="pause-overlay__card">
        <Icon name="gamepad-2" />
        <Text as="h2">Controller Disconnected</Text>
        <Text as="p"><Text as="strong">{name}</Text> is not connected.</Text>
        <Box className="pause-overlay__actions">
          <Text as="p">Reconnect it to continue, or:</Text>
          <Box className="pause-overlay__option">
            <Text>Double-click here to resume</Text>
          </Box>
          {isFunctionBound('pause') && (
            <Box className="pause-overlay__option">
              <FunctionGlyph action="pause" />
              <Text>Resume</Text>
            </Box>
          )}
          {(manager.getProfiles().length > 1 && isFunctionBound('profile-prev') && isFunctionBound('profile-next')) && (
            <Box className="pause-overlay__option">
              <FunctionGlyph action="profile-prev" />
              <FunctionGlyph action="profile-next" />
              <Text>Switch input profile</Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export { PauseOverlay };
