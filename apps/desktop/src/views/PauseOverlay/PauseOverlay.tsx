/* @layer renderer-components @kind component */
import { Box, Button, Icon, Text } from '@drizztdourden08/tessera/primitives';
import { MANUAL_PAUSE } from '@chronoki/input-mapping';
import { getInputManager } from '@app/input/input-manager/get-input-manager';
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
        <Text as="p">{`${name} is not connected. Reconnect it to continue, or resume anyway.`}</Text>
        <Button variant="primary" onClick={() => manager.resume()}>Resume</Button>
      </Box>
    </Box>
  );
};

export { PauseOverlay };
