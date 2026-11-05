/* @layer renderer-appshell @kind component */
import { MobileShell, isMobileHost } from '@drizztdourden08/brock-port-kit/renderer';
import { GameSessionContext } from './GameSession.context';
import type { GameSessionProps } from './GameSession.type';
import { useGameSessionValue } from './behavior/useGameSessionValue';

const GameSession = ({ children }: GameSessionProps) => {
  const value = useGameSessionValue();
  return (
    <GameSessionContext.Provider value={value}>
      {children}
      {isMobileHost() && <MobileShell />}
    </GameSessionContext.Provider>
  );
};

export { GameSession };
