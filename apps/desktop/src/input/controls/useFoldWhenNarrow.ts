/* @layer renderer-components @kind logic */
import { useCallback, useLayoutEffect, useState } from 'react';
import { readFold } from './read-fold';
import { writeFold } from './write-fold';
import type { StoredFold } from './stored-fold.type';

const useFoldWhenNarrow = (storageKey: string, defaultFolded: boolean, narrow: boolean): StoredFold => {
  const [collapsed, setState] = useState(() => readFold(storageKey) ?? defaultFolded);
  const setCollapsed = useCallback((next: boolean) => {
    setState(next);
    writeFold(storageKey, next);
  }, [storageKey]);
  const expand = useCallback(() => setCollapsed(false), [setCollapsed]);
  useLayoutEffect(() => {
    if (narrow) setCollapsed(true);
  }, [narrow, setCollapsed]);
  return { collapsed, setCollapsed, expand };
};

export { useFoldWhenNarrow };
