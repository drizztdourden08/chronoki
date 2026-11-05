/* @layer renderer-components @kind hook */
import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchQuickSlots } from '@app/game/save-slots';
import type { SlotInfo } from '@app/game/save-slots';
import { ANIM_MS } from '../SaveStateOverlay.constants';

const useSaveSlots = (open: boolean, profileId: string | null) => {
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState<'in' | 'out' | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const loadSlots = useCallback(async () => {
    const next = profileId ? await fetchQuickSlots(profileId) : null;
    if (next) setSlots(next);
  }, [profileId]);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    if (open) {
      setVisible(true);
      setAnimating('in');
      void loadSlots();
      timeoutRef.current = setTimeout(() => setAnimating(null), ANIM_MS);
    } else if (visible) {
      setAnimating('out');
      timeoutRef.current = setTimeout(() => {
        setVisible(false);
        setAnimating(null);
        setSlots([]);
      }, ANIM_MS);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [open, loadSlots]);

  return { slots, visible, animating, loadSlots };
};

export { useSaveSlots };
