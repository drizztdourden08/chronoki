/* @layer renderer-components @kind hook */
import { useEffect, useRef, useState } from 'react';
import type { InputProfile } from '@chronoki/input-mapping';
import { getInputManager } from '@app/input/input-manager/get-input-manager';
import { AUTO_HIDE_MS } from '../ProfileSwitcherOverlay.constants';

const useProfileSwitcher = (running: boolean) => {
  const [open, setOpen] = useState(false);
  const [profiles, setProfiles] = useState<InputProfile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!running) return undefined;
    const manager = getInputManager();
    const unsubscribe = manager.onActiveProfileChange((profile) => {
      setProfiles(manager.getProfiles());
      setActiveId(profile.id);
      setOpen(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setOpen(false), AUTO_HIDE_MS);
    });
    return () => {
      unsubscribe();
      clearTimeout(timer.current);
    };
  }, [running]);

  return { open, profiles, activeId };
};

export { useProfileSwitcher };
