/* @layer renderer-components @kind hook */
import { useEffect, useState } from 'react';
import type { RomDetailView } from '../Roms.type';
import { readRomView } from './read-rom-view';

const useRomDetail = (romFile: string | null, version: number) => {
  const [detail, setDetail] = useState<RomDetailView | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!romFile) {
      setDetail(null);
      return undefined;
    }
    let cancelled = false;
    setLoading(true);
    void readRomView(romFile).then((info) => {
      if (cancelled) return;
      setDetail(info);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [romFile, version]);

  return { detail, loading };
};

export { useRomDetail };
