/* @layer renderer-components @kind hook */
import { useEffect, useState } from 'react';
import { ANIM_MS } from '../SaveStateOverlay.constants';

const useOverlayPresence = (open: boolean) => {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setVisible(true);
      return undefined;
    }
    const timer = setTimeout(() => setVisible(false), ANIM_MS);
    return () => clearTimeout(timer);
  }, [open]);

  return { visible: open || visible, exiting: !open && visible };
};

export { useOverlayPresence };
