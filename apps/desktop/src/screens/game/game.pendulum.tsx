/* @layer renderer-app @kind component */
import { useState } from 'react';
import { TitlePendulum } from '@app/compounds/TitlePendulum';
import { useTitlePendulum } from '@app/views/HomeTab';
import GameBackdrop from './game.backdrop';

const GamePendulum = ({ romFile }: { romFile: string | null }) => {
  const art = useTitlePendulum(romFile);
  const [broken, setBroken] = useState(false);

  if (art.status === 'loading') return <GameBackdrop bare />;
  if (art.status === 'missing' || broken) return <GameBackdrop />;
  return <TitlePendulum src={art.url} width={art.width} height={art.height} onError={() => setBroken(true)} />;
};

export { GamePendulum };
