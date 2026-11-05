/* @layer renderer-appshell @kind hook */
import { useEffect } from 'react';
import { profileRemoval } from '@drizztdourden08/brock-react';
import { stopGame } from '@app/game/lifecycle';
import { useGameSession } from '@app/views/GameSession';
import { stopGameBeforeRemove } from './delete-profile-flow';

const useStopGameBeforeRemove = (): void => {
  const { stop } = useGameSession();

  useEffect(() => profileRemoval.add(stopGameBeforeRemove(async () => {
    stop();
    await stopGame();
  })), [stop]);
};

export { useStopGameBeforeRemove };
