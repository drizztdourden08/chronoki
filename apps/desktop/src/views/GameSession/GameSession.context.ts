/* @layer renderer-appshell @kind logic */
import { createContext } from 'react';
import type { GameSessionValue } from './GameSession.type';

const GameSessionContext = createContext<GameSessionValue | null>(null);

export { GameSessionContext };
