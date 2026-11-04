/* @layer renderer-components @kind hook */
import { useEffect, useState } from 'react';
import { readRomDetail } from '@app/storage/roms-store';
import type { RomDetailInfo } from '@app/storage/roms-store';

const useRomDetail = (romFile: string | null, version: number) => {
  const [detail, setDetail] = useState<RomDetailInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!romFile) {
      setDetail(null);
      return undefined;
    }
    let cancelled = false;
    setLoading(true);
    void readRomDetail(romFile).then((info) => {
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
