/* @layer renderer-components @kind hook */
import { useCallback, useState } from 'react';
import { importMsuFolder } from '@app/storage/msu-store';
import type { MsuFolderImport } from '../ProfileManager.type';

const useMsuFolderImport = (onImported: (pack: string) => Promise<void>): MsuFolderImport => {
  const [busy, setBusy] = useState(false);
  const [percent, setPercent] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const importFiles = useCallback(async (files: File[]) => {
    setBusy(true);
    setError(null);
    setPercent(0);
    const result = await importMsuFolder(files, (done, total) => setPercent(total > 0 ? (done / total) * 100 : null));
    if (result.success) await onImported(result.pack);
    else setError(result.error);
    setPercent(null);
    setBusy(false);
  }, [onImported]);

  return { busy, percent, error, importFiles };
};

export { useMsuFolderImport };
