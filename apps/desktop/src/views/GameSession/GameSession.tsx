/* @layer renderer-appshell @kind component */
import { GameSessionContext } from './GameSession.context';
import type { GameSessionProps } from './GameSession.type';
import { useGameSessionValue } from './behavior/useGameSessionValue';

const GameSession = ({ children }: GameSessionProps) => {
  const value = useGameSessionValue();
  return <GameSessionContext.Provider value={value}>{children}</GameSessionContext.Provider>;
};

export { GameSession };
