/* @layer renderer-components @kind hook */
import { useCallback, useState } from 'react';
import type { LibraryImportResult, LibraryRom } from '../Library.type';
import { importRom } from './import-rom';

const useLibrary = () => {
  // TODO(P3): list the ROMs under Data/roms through the FileStore.
  const [roms] = useState<LibraryRom[]>([]);
  const [status, setStatus] = useState<LibraryImportResult | null>(null);

  const handleDrop = useCallback(async (files: File[]) => {
    setStatus(await importRom(files));
  }, []);

  return { roms, status, handleDrop };
};

export { useLibrary };
