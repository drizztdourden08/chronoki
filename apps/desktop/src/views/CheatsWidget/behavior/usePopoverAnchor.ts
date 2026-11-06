/* @layer renderer-widgets @kind hook */
import { useState } from 'react';
import type { MouseEvent } from 'react';
import type { PopoverAnchor } from './popover-anchor.type';


const usePopoverAnchor = <K extends string>() => {
  const [open, setOpen] = useState<PopoverAnchor<K>>(null);
  const show = (kind: K) => (e: MouseEvent<HTMLElement>): void => setOpen({ kind, anchor: e.currentTarget });
  return { open, show, close: (): void => setOpen(null) };
};

export { usePopoverAnchor };
