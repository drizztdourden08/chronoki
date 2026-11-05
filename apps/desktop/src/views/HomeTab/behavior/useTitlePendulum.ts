/* @layer renderer-components @kind hook */
import { useEffect, useState } from 'react';
import { loadTitlePendulum } from '@app/storage/title-pendulum';
import type { TitlePendulumArt } from '@app/storage/title-pendulum';
import type { TitlePendulumState } from '../HomeTab.type';
import { pendulumRomOf } from './pendulum-rom-of';

const artOf = async (romFile: string | null): Promise<TitlePendulumArt | null> => {
  const rom = await pendulumRomOf(romFile).catch(() => null);
  return rom ? loadTitlePendulum(rom) : null;
};

const useTitlePendulum = (romFile: string | null): TitlePendulumState => {
  const [state, setState] = useState<TitlePendulumState>({ status: 'loading' });

  useEffect(() => {
    let current = true;
    let url: string | null = null;
    setState({ status: 'loading' });
    void artOf(romFile).then((art) => {
      if (!current) return;
      if (!art) {
        setState({ status: 'missing' });
        return;
      }
      url = URL.createObjectURL(new Blob([art.png.slice()], { type: 'image/png' }));
      setState({ status: 'ready', url, width: art.width, height: art.height });
    });
    return () => {
      current = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [romFile]);

  return state;
};

export { useTitlePendulum };
