/* @layer renderer-components @kind component */
import { ControllerPauseLayer } from '@drizztdourden08/brock-input/renderer';
import { MANUAL_PAUSE } from '@chronoki/input-mapping';
import { FunctionGlyph } from '@app/compounds/FunctionGlyph';
import { getInputManager } from '@app/input/input-manager/get-input-manager';
import { isFunctionBound } from '@app/input/input-manager/is-function-bound';
import { useGameSession } from '@app/views/GameSession';

const glyphOf = (action: 'pause' | 'profile-prev' | 'profile-next') =>
  (isFunctionBound(action) ? <FunctionGlyph action={action} /> : undefined);

const PauseLayer = () => {
  const { status } = useGameSession();
  const manager = getInputManager();

  return (
    <ControllerPauseLayer
      status={status}
      source={manager}
      manualPauseName={MANUAL_PAUSE}
      canSwitchProfile={manager.getProfiles().length > 1}
      onResume={() => manager.resume()}
      resumeGlyph={glyphOf('pause')}
      prevGlyph={glyphOf('profile-prev')}
      nextGlyph={glyphOf('profile-next')}
    />
  );
};

export { PauseLayer };
