/* @layer renderer-appshell @kind hook */
import { useContext } from 'react';
import { GameSessionContext } from '../GameSession.context';
import type { GameSessionValue } from '../GameSession.type';

const useGameSession = (): GameSessionValue => {
  const value = useContext(GameSessionContext);
  if (!value) throw new Error('useGameSession needs the GameSession provider');
  return value;
};

export { useGameSession };
