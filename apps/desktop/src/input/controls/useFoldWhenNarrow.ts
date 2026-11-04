/* @layer renderer-components @kind logic */
import { useEffect, useState } from 'react';
import { NARROW_FOLD_WIDTH } from './controls.constants';

const useFoldWhenNarrow = (defaultFolded: boolean) => {
  const [collapsed, setCollapsed] = useState(defaultFolded || window.innerWidth < NARROW_FOLD_WIDTH);
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < NARROW_FOLD_WIDTH) setCollapsed(true);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return { collapsed, setCollapsed };
};

export { useFoldWhenNarrow };
