/* @layer renderer-components @kind component */
import { useEffect, useRef } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import type { SlotHoldFillProps } from '../SaveSlot.type';

const SlotHoldFill = ({ progress }: SlotHoldFillProps) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    ref.current?.style.setProperty('--save-slot-hold', String(progress));
  }, [progress]);

  return <Box ref={ref} className="save-slot__fill" />;
};

export { SlotHoldFill };
