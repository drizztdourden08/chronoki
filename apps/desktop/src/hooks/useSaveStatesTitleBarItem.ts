/* @layer renderer-app @kind hook */
import { useContext } from 'react';
import type { TitleBarItemSpec } from '@drizztdourden08/brock-react';
import { GameSessionContext } from '@app/views/GameSession/GameSession.context';
import { toggleSaveOverlay } from '@app/views/GameSession';

const useSaveStatesTitleBarItem = (): TitleBarItemSpec | null => {
  const session = useContext(GameSessionContext);
  if (!session?.running || !session.gates.has('saveStates')) return null;
  return { kind: 'button', label: 'Save States', icon: 'save', onSelect: toggleSaveOverlay };
};

export { useSaveStatesTitleBarItem };
