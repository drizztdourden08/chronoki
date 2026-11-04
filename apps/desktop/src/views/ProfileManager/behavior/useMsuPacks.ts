/* @layer renderer-components @kind hook */
import { useEffect, useState } from 'react';
import { listMsuPacks } from '@app/storage/msu-store';

const useMsuPacks = (): string[] => {
  const [packs, setPacks] = useState<string[]>([]);

  useEffect(() => {
    let current = true;
    void listMsuPacks()
      .then((found) => { if (current) setPacks(found.filter((p) => p.notForThisGame === null).map((p) => p.name)); })
      .catch(() => { if (current) setPacks([]); });
    return () => { current = false; };
  }, []);

  return packs;
};

export { useMsuPacks };
