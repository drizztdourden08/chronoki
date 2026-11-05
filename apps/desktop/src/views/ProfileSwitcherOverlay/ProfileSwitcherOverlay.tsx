/* @layer renderer-components @kind component */
import { ProfileSwitcherOverlay as BrockProfileSwitcherOverlay } from '@drizztdourden08/brock-input/renderer';
import { FunctionGlyph } from '@app/compounds/FunctionGlyph';
import { isFunctionBound } from '@app/input/input-manager/is-function-bound';
import { useGameSession } from '@app/views/GameSession';
import { useProfileSwitcher } from './behavior/useProfileSwitcher';

const ProfileSwitcherOverlay = () => {
  const { running } = useGameSession();
  const { open, profiles, activeId } = useProfileSwitcher(running);

  return (
    <BrockProfileSwitcherOverlay
      open={open}
      profiles={profiles}
      activeId={activeId}
      prevGlyph={isFunctionBound('profile-prev') ? <FunctionGlyph action="profile-prev" /> : undefined}
      nextGlyph={isFunctionBound('profile-next') ? <FunctionGlyph action="profile-next" /> : undefined}
    />
  );
};

export { ProfileSwitcherOverlay };
