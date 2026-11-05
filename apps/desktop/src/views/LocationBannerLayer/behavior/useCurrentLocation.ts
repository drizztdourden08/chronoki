/* @layer renderer-components @kind hook */
import { useEffect, useState } from 'react';
import { chronokiRawMemoryBridge } from '@app/game/randomizer/chronoki-raw-memory-bridge';
import { LOCATION_MASK, LOCATION_POLL_MS, LOCATION_WRAM } from '../LocationBannerLayer.constants';

const readLocation = (): number | null => {
  const view = chronokiRawMemoryBridge.view();
  return view ? view.word('wram', LOCATION_WRAM) & LOCATION_MASK : null;
};

const useCurrentLocation = (active: boolean): number | null => {
  const [location, setLocation] = useState<number | null>(null);

  useEffect(() => {
    if (!active) {
      setLocation(null);
      return undefined;
    }
    const timer = window.setInterval(() => setLocation(readLocation()), LOCATION_POLL_MS);
    return () => window.clearInterval(timer);
  }, [active]);

  return location;
};

export { useCurrentLocation };
