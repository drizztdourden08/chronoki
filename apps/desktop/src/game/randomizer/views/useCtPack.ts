/* @layer renderer-components @kind hook */
import { useEffect, useState } from 'react';
import { packOfRom } from '../pack-of-rom';
import { NO_ROM_STATE, PACK_PENDING } from './ct-pack-state.constants';
import type { CtPackState } from './ct-pack-state.type';

const messageOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

const useCtPack = (romFile: string | null): CtPackState => {
  const [state, setState] = useState<CtPackState>(PACK_PENDING);
  useEffect(() => {
    if (romFile === null) {
      setState(NO_ROM_STATE);
      return undefined;
    }
    let live = true;
    setState(PACK_PENDING);
    packOfRom(romFile)
      .then((pack) => live && setState({ pack, error: undefined }))
      .catch((error: unknown) => live && setState({ pack: null, error: messageOf(error) }));
    return () => { live = false; };
  }, [romFile]);
  return state;
};

export { useCtPack };
